from rest_framework import serializers

from apps.catalog import models
from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES
from apps.catalog.api.serializers.category import CategorySerializer
from apps.catalog.api.serializers.variation import (
    ProductVariationOption,
    VariationOptionSerializer,
)


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


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    variation_options = ProductVariationOption(many=True)

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
            "variation_options",
            "details",
            "materials",
            "care",
        ]


class BaseProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(6, message=PRODUCT_ERROR_MESSAGES["name_length"])
        ],
    )

    description = serializers.CharField(
        validators=[
            MinLengthValidator(20, message=PRODUCT_ERROR_MESSAGES["description_length"])
        ]
    )

    base_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(1, message=PRODUCT_ERROR_MESSAGES["price_min"])],
    )

    details = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
        error_messages={"empty": PRODUCT_ERROR_MESSAGES["empty_details"]},
    )

    care = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
        error_messages={"empty": PRODUCT_ERROR_MESSAGES["empty_care"]},
    )

    materials = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
        error_messages={"empty": PRODUCT_ERROR_MESSAGES["empty_materials"]},
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
            "variation_options",
        ]



class ProductUpdateSerializer(BaseProductSerializer):
    def validate(self, attrs):
        errors = self._validate_common_fields(attrs, require_all=False)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)


class ProductCreateSerializer(ProductUpdateSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )

    def validate(self, attrs):
        errors = self._validate_common_fields(attrs, require_all=True)

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
