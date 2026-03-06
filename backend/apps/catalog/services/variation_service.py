from django.db import IntegrityError
from rest_framework import serializers
from typing_extensions import TypedDict

from apps.catalog import models


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
                                    f"Variation option {option_name} already exists"
                                ]
                            }
                        }
                    }
                )
