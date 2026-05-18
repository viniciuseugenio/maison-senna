from rest_framework import serializers


class AddToCartSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)


class UpdateCartSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
    quantity = serializers.IntegerField(min_value=0)


class RemoveCartItemSerializer(serializers.Serializer):
    variation_sku = serializers.CharField()
