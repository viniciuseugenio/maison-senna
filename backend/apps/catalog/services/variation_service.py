import itertools
from typing import List

from django.db import IntegrityError, transaction
from rest_framework import serializers
from typing_extensions import TypedDict

from apps.catalog import models
from apps.catalog.models import Product, ProductVariation
from utils.sku_generator import generate_sku


class OptionObject(TypedDict):
    id: str
    name: str
    price_modifier: str


class VariationOptions(TypedDict):
    kind: models.VariationKind
    options: list[OptionObject]


def create_variation_options(
    variation_options: list[VariationOptions],
    product_instance: models.Product,
):

    for index, option_data in enumerate(variation_options):
        kind = option_data.get("kind")

        for option in option_data.get("options"):
            if option.get("id"):
                continue

            option_name = option.get("name")
            price_modifier = option.get("price_modifier")

            try:
                models.VariationOption.objects.create(
                    kind=kind,
                    product=product_instance,
                    name=option_name,
                    price_modifier=price_modifier,
                )
            except IntegrityError:
                raise serializers.ValidationError(
                    {
                        "variation_options": {
                            index: {
                                "options": [
                                    f'Variation option "{option_name}" already exists'
                                ]
                            }
                        }
                    }
                )


def sync_product_variations(product: Product) -> List[ProductVariation]:
    options_by_kind = {}

    # Take all the options related to the product, and store them in a dict,
    # with the key being the kind name.
    for option in product.variation_options.select_related("kind").all():
        kind = option.kind.name
        if kind not in options_by_kind:
            options_by_kind[kind] = []
        options_by_kind[kind].append(option)

    # If there is no option related to that product,
    # it means that there should also be no variants.
    # Hence, if no options_by_kind, we deactivate everything.
    if not options_by_kind:
        for variant in product.variations.all():
            if variant.is_active:
                variant.is_active = False
                variant.save(update_fields=["is_active"])
        return []

    kind_names = sorted(options_by_kind.keys())
    option_lists = [options_by_kind[kind] for kind in kind_names]
    combinations = list(itertools.product(*option_lists))

    # Take the combinations, which is a list consisting of lists of instances of variation options,
    # and transform those instances into ids
    valid_combinations = [
        frozenset(option.id for option in combination) for combination in combinations
    ]

    created_variations = []

    with transaction.atomic():
        existing_variants = list(product.variations.prefetch_related("options"))
        existing_by_combination = {}

        # Map through existing variants, and check if the options of that variant match any combination
        # If not, set the variant as inactive
        for variant in existing_variants:
            options_ids = frozenset(option.id for option in variant.options.all())
            existing_by_combination[options_ids] = variant

            if options_ids not in valid_combinations and variant.is_active:
                variant.is_active = False
                variant.save(update_fields=["is_active"])

        for combination in combinations:
            combination_ids = frozenset(option.id for option in combination)
            existing = existing_by_combination.get(combination_ids)

            if existing:
                if not existing.is_active:
                    existing.is_active = True
                    existing.save(update_fields=["is_active"])
                continue

            sku = generate_sku(product, combination)

            variation = ProductVariation.objects.create(
                product=product, sku=sku, stock=0
            )
            variation.options.set(combination)
            created_variations.append(variation)

    return created_variations
