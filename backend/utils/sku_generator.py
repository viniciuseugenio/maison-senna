import random
import string
from typing import List

from apps.catalog.models import Product, ProductVariation, VariationOption


def generate_sku(product: Product, options: List[VariationOption]) -> str:
    product_base = f"{product.name[:3]}{product.pk}".upper()

    option_parts = []
    for option in sorted(options, key=lambda x: x.kind.name):
        kind_code = option.kind.sku_abbr
        option_code = option.name[:3].upper()
        option_parts.append(f"{kind_code}-{option_code}")

    random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))

    sku = f"{product_base}-{'-'.join(option_parts)}-{random_suffix}"

    while ProductVariation.objects.filter(sku=sku).exists():
        random_suffix = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=4)
        )

        sku = f"{product_base}-{'-'.join(option_parts)}-{random_suffix}"

    return sku
