from rest_framework import status
from rest_framework.exceptions import APIException

from apps.catalog.api import constants


class CartNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = constants.CART_ERROR_MESSAGES.get("not_found")
    default_code = "cart_not_found"
