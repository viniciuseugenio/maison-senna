from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES

from .. import models


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=models.Category.objects.all(),
                message="A category with this name already exists.",
            )
        ]
    )
    slug = serializers.SlugField(read_only=True)

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
    ]


class BaseProductSerializer(serializers.ModelSerializer):
    ERROR_MESSAGES = PRODUCT_ERROR_MESSAGES

    class Meta(ProductSerializerFieldsMixin):
        pass

    def _validate_common_fields(self, attrs, require_all=False):
        errors = {}

        name = attrs.get("name")
        base_price = attrs.get("base_price")
        details = attrs.get("details")
        care = attrs.get("care")
        materials = attrs.get("materials")

        if (require_all or name is not None) and len(name or "") < 6:
            errors["name"] = self.ERROR_MESSAGES["name_length"]

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
