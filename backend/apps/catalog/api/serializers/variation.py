from rest_framework import serializers

from apps.catalog import models


class VariationKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationKind
        fields = ["id", "name"]


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


class VariationTypeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationType
        fields = ["id", "kind", "product"]

    def validate(self, attrs):
        kind = attrs.get("kind")
        product = attrs.get("product")
        already_exists = models.VariationType.objects.filter(
            kind=kind, product=product
        ).exists()

        if already_exists:
            raise serializers.ValidationError(
                {"kind": "A variation type with this kind and product already exists"}
            )

        return super().validate(attrs)


class VariationOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationOption
        fields = ["id", "name", "price_modifier"]


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
