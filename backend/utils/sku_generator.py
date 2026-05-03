import random
import string
from typing import List

from apps.catalog.models import Product, ProductVariation, VariationOption


def sku_joiner(product_base: str, option_parts: List[str] | None, random_suffix: str):
    if option_parts:
        return f"{product_base}-{'-'.join(option_parts)}-{random_suffix}"
    else:
        return f"{product_base}-{random_suffix}"


def generate_sku(product: Product, options: List[VariationOption] | None) -> str:
    product_base = f"{product.name[:3]}{product.pk}".upper()
    random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))

    option_parts = []
    for option in sorted(options or [], key=lambda x: x.kind.name):
        kind_code = option.kind.sku_abbr
        option_code = option.name[:3].upper()
        option_parts.append(f"{kind_code}-{option_code}")

    sku = sku_joiner(product_base, option_parts, random_suffix)

    while ProductVariation.objects.filter(sku=sku).exists():
        random_suffix = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=4)
        )

        sku = sku_joiner(product_base, option_parts, random_suffix)

    return sku
