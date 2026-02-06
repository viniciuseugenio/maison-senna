from django.core.validators import MinLengthValidator, MinValueValidator
from rest_framework import serializers

from apps.catalog import models
from apps.catalog.api.constants import PRODUCT_ERROR_MESSAGES
from apps.catalog.api.serializers.category import CategorySerializer
from apps.catalog.api.serializers.variation import (
    ProductVariationOption,
    VariationOptionCreateSerializer,
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
            "is_featured",
        ]


class ProductCreateSerializer(BaseProductSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )
    variation_options = VariationOptionCreateSerializer(many=True, required=False)

    def create(self, validated_data):
        variation_options = validated_data.pop("variation_options", [])
        instance = super().create(validated_data)

        for option_data in variation_options:
            kind = option_data.get("kind")

            for option in option_data.get("options"):
                models.VariationOption.objects.create(
                    kind=kind,
                    product=instance,
                    name=option.get("name"),
                    price_modifier=option.get("price_modifier"),
                )

        return instance


class ProductUpdateSerializer(BaseProductSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all()
    )
    variation_options = VariationOptionCreateSerializer(many=True, required=False)

    class Meta(BaseProductSerializer.Meta):
        fields = BaseProductSerializer.Meta.fields
        extra_kwargs = {
            "name": {"required": False},
            "description": {"required": False},
            "base_price": {"required": False},
            "reference_image": {"required": False},
            "details": {"required": False},
            "materials": {"required": False},
            "care": {"required": False},
            "variation_options": {"required": False},
            "is_featured": {"required": False},
        }

    def update(self, instance, validated_data):
        variations_data = validated_data.pop("variation_options", None)
        instance = super().update(instance, validated_data)

        if variations_data is not None:
            for variation_object in variations_data:
                kind = variation_object.get("kind")

                options = variation_object.get("options")
                for option in options:
                    id = option.get("id")
                    if id:
                        continue

                    name = option.get("name")
                    price_modifier = option.get("price_modifier")

                    models.VariationOption.objects.create(
                        kind=kind,
                        product=instance,
                        name=name,
                        price_modifier=price_modifier,
                    )

        return instance


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
