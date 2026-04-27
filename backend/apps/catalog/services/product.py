from django.db import transaction

from apps.catalog.models import Product
from apps.catalog.services.variation_service import create_variation_options


@transaction.atomic
def save_product_and_sync_options(validated_data, instance=None):
    variation_options = validated_data.pop("variation_options", None)
    if not instance:
        instance = Product.objects.create(**validated_data)
    else:
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

    if variation_options:
        create_variation_options(variation_options, instance)
        instance.sync_variations()

    return instance
