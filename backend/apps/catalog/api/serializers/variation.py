from rest_framework import serializers

from apps.catalog import models


class VariationKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VariationKind
        fields = ["id", "name"]


class VariationOptionSerializer(serializers.ModelSerializer):
    kind = VariationKindSerializer(read_only=True)

    class Meta:
        model = models.VariationOption
        fields = ["id", "kind", "name", "price_modifier"]


class VariationOptionCreateSerializer(serializers.ModelSerializer):
    kind = serializers.PrimaryKeyRelatedField(
        queryset=models.VariationKind.objects.all()
    )

    class Meta:
        model = models.VariationOption
        fields = ["kind", "name", "price_modifier"]
