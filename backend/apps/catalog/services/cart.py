from typing import TypedDict

from django.core.cache import cache

from apps.catalog.api import constants


class CartIdNotFound(Exception):
    pass


class CartItem(TypedDict):
    product_id: int
    variation_sku: str
    quantity: int
    unit_price: float
    image_url: str
    options: list[str]
    product_name: str


class CartData(TypedDict):
    subtotal: float
    items: list[CartItem]


def resolve_cart_identity(request):
    user = request.user
    guest_id = request.COOKIES.get(constants.GUEST_CART_ID)

    if not user.is_authenticated and not guest_id:
        raise CartIdNotFound()

    return {
        "cart_id": user.pk if user.is_authenticated else guest_id,
        "is_guest": not user.is_authenticated,
    }


def _cart_cache_key(id: str | int, is_guest: bool = False) -> str:
    key = f"cart:user:{id}" if not is_guest else f"cart:guest:{id}"
    return key


def get_cart_from_cache(id, is_guest: bool = False) -> CartData:
    key = _cart_cache_key(id, is_guest)
    return cache.get(key)


def save_cart_to_cache(cart_data, id, is_guest: bool = False):
    key = _cart_cache_key(id, is_guest)
    guests_timeout = 14 * 24 * 60 * 60  # 14 days
    auth_timeout = 30 * 24 * 60 * 60  # 30 days
    timeout = guests_timeout if is_guest else auth_timeout
    return cache.set(key, cart_data, timeout)
