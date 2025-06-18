from rest_framework import serializers

from .. import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["id", "name", "slug"]


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = models.Product
        fields = [
            "id",
            "category",
            "name",
            "slug",
            "base_price",
            "reference_image",
        ]


class VariationKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationKind
        fields = ["id", "name"]


class VariationOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationOption
        fields = ["id", "name", "price_modifier"]


class DashboardVariationTypeSerializer(serializers.ModelSerializer):
    kind = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()

    class Meta:
        model = models.VariationType
        fields = ["id", "kind", "product"]

    def get_kind(self, obj):
        return obj.kind.name

    def get_product(self, obj):
        return obj.product.name


class VariationOptionsListSerializer(serializers.ModelSerializer):
    type = DashboardVariationTypeSerializer()

    class Meta:
        model = models.VariationOption
        fields = ["id", "type", "name", "price_modifier"]


class VariationTypeSerializer(serializers.ModelSerializer):
    kind = VariationKindSerializer(read_only=True)
    options = VariationOptionSerializer(many=True, read_only=True)

    class Meta:
        model = models.VariationType
        fields = ["id", "kind", "options"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    details = serializers.ListField(child=serializers.CharField())
    variation_types = VariationTypeSerializer(read_only=True, many=True)
    materials = serializers.ListField(child=serializers.CharField())
    care = serializers.ListField(child=serializers.CharField())
    reference_image = serializers.ImageField()

    class Meta:
        model = models.Product
        fields = [
            "id",
            "category",
            "name",
            "slug",
            "base_price",
            "reference_image",
            "description",
            "variation_types",
            "details",
            "materials",
            "care",
        ]


class ProductCreateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )

    class Meta:
        model = models.Product
        fields = [
            "id",
            "category",
            "name",
            "base_price",
            "reference_image",
            "description",
            "details",
            "materials",
            "care",
        ]

    def validate(self, attrs):
        errors = {}

        if len(attrs.get("care")) < 1:
            errors["care"] = "The product must have at least one care instruction."

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)


class ProductVariationSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    options = VariationOptionSerializer(many=True)

    class Meta:
        model = models.ProductVariation
        fields = [
            "id",
            "product",
            "sku",
            "stock",
            "image",
            "options",
        ]

    def get_product(self, obj):
        return obj.product.name
