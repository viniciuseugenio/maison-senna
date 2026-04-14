from django.db import transaction
from rest_framework import serializers

from apps.catalog import models
from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES
from apps.catalog.api.serializers.category import CategorySerializer
from apps.catalog.api.serializers.utils import parse_form_data
from apps.catalog.api.serializers.variation import (
    ProductVariationOption,
    VariationOptionCreateSerializer,
    VariationOptionSerializer,
)
from apps.catalog.services.variation_service import create_variation_options


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
    is_wishlisted = serializers.SerializerMethodField()

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
            "is_featured",
            "is_wishlisted",
        ]

    def get_is_wishlisted(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return models.WishlistItem.objects.filter(
                user=request.user, product=obj
            ).exists()
        return False


class BaseProductSerializer(serializers.ModelSerializer):
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
            "is_featured",
        ]

        extra_kwargs = {
            "details": {
                "error_messages": {"empty": PRODUCT_ERROR_MESSAGES["empty_details"]}
            },
            "care": {"error_messages": {"empty": PRODUCT_ERROR_MESSAGES["empty_care"]}},
            "materials": {
                "error_messages": {"empty": PRODUCT_ERROR_MESSAGES["empty_materials"]}
            },
        }


class ProductCreateSerializer(BaseProductSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )
    variation_options = VariationOptionCreateSerializer(many=True, required=False)

    def create(self, validated_data):
        variation_options = validated_data.pop("variation_options", None)

        with transaction.atomic():
            instance = super().create(validated_data)

            if variation_options is not None:
                create_variation_options(variation_options, instance)

        return instance

    def to_representation(self, instance):
        return ProductSerializer(instance).data

    def to_internal_value(self, data):
        parsed_data = parse_form_data(data)
        return super().to_internal_value(parsed_data)


class ProductUpdateSerializer(BaseProductSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )
    variation_options = VariationOptionCreateSerializer(many=True, required=False)

    def update(self, instance, validated_data):
        variation_options = validated_data.pop("variation_options", None)
        instance = super().update(instance, validated_data)

        if variation_options is not None:
            create_variation_options(variation_options, instance)

        return instance

    def to_representation(self, instance):
        return ProductSerializer(instance).data

    def to_internal_value(self, data):
        parsed_data = parse_form_data(data)
        return super().to_internal_value(parsed_data)


class ProductVariationSerializer(serializers.ModelSerializer):
    options = VariationOptionSerializer(many=True)

    class Meta:
        model = models.ProductVariation
        fields = [
            "id",
            "sku",
            "stock",
            "image",
            "options",
        ]
        read_only_fields = ["sku", "options"]

    def get_product(self, obj):
        return obj.product.name


class ProductWithVariationOptions(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True)
    category = CategorySerializer()

    class Meta:
        model = models.Product
        fields = [
            "id",
            "name",
            "category",
            "base_price",
            "reference_image",
            "variations",
        ]


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = models.WishlistItem
        fields = ["id", "user", "product", "added_at"]
        read_only_fields = ["added_at"]


class WishlistItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = models.WishlistItem
        fields = ["product_id"]

    def validate_product_id(self, value):
        if not models.Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Product not found")

        return value

    def create(self, validated_data):
        product_id = validated_data.pop("product_id")
        return models.WishlistItem.objects.get_or_create(
            user=self.context["request"].user,
            product_id=product_id,
        )[0]
