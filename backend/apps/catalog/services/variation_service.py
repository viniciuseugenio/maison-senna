from django.db import IntegrityError
from pydantic import BaseModel
from rest_framework import serializers

from apps.catalog import models


class OptionObject(BaseModel):
    id: str
    name: str
    price_modifier: str


class VariationOptions(BaseModel):
    kind: str
    options: list[OptionObject]


def create_variation_options(
    variation_options: list[VariationOptions],
    product_instance: models.Product,
):
    for index, option_data in enumerate(variation_options):
        kind = option_data.kind

        for option in option_data.options:
            id = option.id
            if id:
                continue

            option_name = option.name
            price_modifier = option.price_modifier

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
