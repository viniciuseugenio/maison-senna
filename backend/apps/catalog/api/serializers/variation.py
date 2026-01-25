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


class VariationOptionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationOption
        fields = ["id", "name", "price_modifier"]
        extra_kwargs = {"price_modifier": {"required": False}}


class ProductVariationOption(serializers.ModelSerializer):
    kind = VariationKindSerializer()

    class Meta:
        model = models.VariationOption
        fields = ["id", "kind", "name", "price_modifier"]


class VariationOptionInputSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationOption.objects.all(), required=False
    )

    class Meta:
        model = models.VariationOption
        fields = ["id", "name", "price_modifier"]


class VariationOptionCreateSerializer(serializers.Serializer):
    kind = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationKind.objects.all()
    )
    options = VariationOptionInputSerializer(many=True)
