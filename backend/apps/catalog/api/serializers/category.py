from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.catalog import models


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
        fields = ["id", "name", "slug", "cover", "description"]


class CategoryWProductsSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = models.Category
        fields = ["id", "name", "slug", "cover", "description", "products"]

    def get_products(self, obj):
        from apps.catalog.api.serializers.product import ProductListSerializer

        return ProductListSerializer(
            obj.products.all(), many=True, context=self.context
        ).data
