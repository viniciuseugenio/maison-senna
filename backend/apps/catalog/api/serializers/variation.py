from rest_framework import serializers

from apps.catalog import models


class VariationKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationKind
        fields = ["id", "name"]


class ProductBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ["id", "name", "slug"]


class VariationOptionSerializer(serializers.ModelSerializer):
    kind = VariationKindSerializer(read_only=True)
    product = ProductBasicSerializer()

    class Meta:
        model = models.VariationOption
        fields = ["id", "kind", "product", "name", "price_modifier"]


class VariationOptionCreateSerializer(serializers.ModelSerializer):
    kind = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationKind.objects.all()
    )
class ProductVariationOption(serializers.ModelSerializer):
    kind = VariationKindSerializer()

    class Meta:
        model = models.VariationOption
        fields = ["id", "kind", "name", "price_modifier"]


