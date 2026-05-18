from typing import TypedDict

from rest_framework import serializers


class CartItem(TypedDict):
    variation_sku: str
    quantity: int


class AddToCartSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)


class UpdateCartSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
    quantity = serializers.IntegerField(min_value=0)


class RemoveCartItemSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
