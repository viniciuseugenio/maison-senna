from rest_framework import serializers

from apps.catalog import models
from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES
from apps.catalog.api.serializers.category import CategorySerializer
from apps.catalog.api.serializers.variation import VariationOptionSerializer


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
    details = serializers.ListField(child=serializers.CharField())
    materials = serializers.ListField(child=serializers.CharField())
    care = serializers.ListField(child=serializers.CharField())
    reference_image = serializers.ImageField()
    variation_options = VariationOptionSerializer(many=True)

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


class ProductSerializerFieldsMixin:
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
        "variations",
    ]


class BaseProductSerializer(serializers.ModelSerializer):
    ERROR_MESSAGES = PRODUCT_ERROR_MESSAGES

    class Meta(ProductSerializerFieldsMixin):
        pass

    def _validate_common_fields(self, attrs, require_all=False):
        errors = {}

        name = attrs.get("name")
        description = attrs.get("description")
        base_price = attrs.get("base_price")
        details = attrs.get("details")
        care = attrs.get("care")
        materials = attrs.get("materials")

        if (require_all or name is not None) and len(name or "") < 6:
            errors["name"] = self.ERROR_MESSAGES["name_length"]

        if (require_all or description is not None) and len(description or "") < 20:
            errors["description"] = self.ERROR_MESSAGES["description_length"]

        if (require_all or base_price is not None) and base_price < 1:
            errors["base_price"] = self.ERROR_MESSAGES["price_min"]

        if (require_all or details is not None) and not details:
            errors["details"] = self.ERROR_MESSAGES["empty_details"]

        if (require_all or care is not None) and not care:
            errors["care"] = self.ERROR_MESSAGES["empty_care"]

        if (require_all or materials is not None) and not materials:
            errors["materials"] = self.ERROR_MESSAGES["empty_materials"]

        return errors


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
