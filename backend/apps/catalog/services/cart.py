from collections import defaultdict
from typing import TypedDict

from django.core.cache import cache
from django.http import HttpRequest
from rest_framework.views import Response

from apps.catalog.api import constants
from apps.catalog.models import ProductVariation


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


def merge_guest_cart(request: HttpRequest, response: Response, user):
    """
    Merges the shopping cart of a guest user with the authenticated user's cart upon login.

    This function retrieves the cart associated with the guest (from a cookie) and the logged-in user (from the session),
    combines the items, respects item stock, recalculates quantities as needed, and stores the merged cart
    under the authenticated user. It deletes the guest cart cookie and cache entry once merged.

    Args:
        request (HttpRequest): The HTTP request object.
            - Expects `request.user` to be the authenticated user.
            - Expects a guest cart ID in `request.COOKIES[constants.GUEST_CART_ID]`.
        response (Response): The HTTP response object, modified in-place to delete the guest cart cookie.

    Returns:
        Response: The given `response` object with the guest cart cookie deleted,
        after merging carts and updating the user's cart information in cache.

    Process:
        1. Fetch cart data for both guest and authenticated user from cache.
        2. Combine items from both carts into one list.
        3. Group items by variation SKU and sum their quantities, capping at available stock.
        4. Build a merged cart, preserving item details and updating total quantities.
        5. Compute new cart subtotal.
        6. Delete the guest cart cookie and its cache entry.
        7. Save the merged cart to the authenticated user's cache.
        8. Return the modified response object.

    Side Effects:
        - Deletes guest cart cookie from the response.
        - Removes the guest cart from cache.
        - Updates the user's cart in cache.
    """

    guest_id = request.COOKIES.get(constants.GUEST_CART_ID)
    guest_cache_key = _cart_cache_key(guest_id, True)

    guest_cart: CartData = get_cart_from_cache(guest_id, True)
    user_cart: CartData = get_cart_from_cache(user.pk)

    all_items = [
        *(guest_cart or {}).get("items", []),
        *(user_cart or {}).get("items", []),
    ]
    new_cart: CartData = {"subtotal": 0, "items": []}
    lookup = defaultdict(list)
    for item in all_items:
        lookup[item["variation_sku"]].append(item)

    skus = lookup.keys()
    variation_models = ProductVariation.objects.in_bulk(skus, field_name="sku")

    for key in skus:
        variation = variation_models[key]

        qty = sum([item["quantity"] for item in lookup[key]])
        if qty > variation.stock:
            qty = variation.stock

        base_item = lookup[key][0]
        base_item["quantity"] = qty
        new_cart["items"].append(base_item)

    subtotal = sum(
        [item["unit_price"] * item["quantity"] for item in new_cart["items"]]
    )
    new_cart["subtotal"] = subtotal

    response.delete_cookie(constants.GUEST_CART_ID)
    cache.delete(guest_cache_key)
    save_cart_to_cache(new_cart, user.pk)
    return response
