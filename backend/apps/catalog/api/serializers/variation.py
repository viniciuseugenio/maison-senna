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


class ProductVariationOption(serializers.ModelSerializer):
    kind = VariationKindSerializer()

    class Meta:
        model = models.VariationOption
        fields = ["id", "kind", "name", "price_modifier"]


class VariationOptionInputSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationOption.objects.all(), required=False
    )
    name = serializers.CharField(max_length=255)


class VariationOptionCreateSerializer(serializers.Serializer):
    kind = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationKind.objects.all()
    )
    options = VariationOptionInputSerializer(many=True)
