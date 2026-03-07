from django.core.validators import MinLengthValidator, MinValueValidator

from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES

name_min_length = MinLengthValidator(6, message=PRODUCT_ERROR_MESSAGES["name_length"])

description_min_length = MinLengthValidator(
    20, message=PRODUCT_ERROR_MESSAGES["description_length"]
)

base_price_min_value = MinValueValidator(1, message=PRODUCT_ERROR_MESSAGES["price_min"])
