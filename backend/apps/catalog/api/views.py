from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from .. import models
from . import serializers

User = get_user_model()


class OrderedAdminListView(ListAPIView):
    permission_classes = [IsAdminUser]
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]


class OrderedListMixin:
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]


class ProductViewSet(ModelViewSet):
    queryset = models.Product.objects.all()
    lookup_field = "slug"
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.ProductSerializer

        if self.action == "create":
            return serializers.ProductCreateSerializer

        if self.action == "partial_update":
            return serializers.ProductUpdateSerializer

        return serializers.ProductListSerializer

    def get_permissions(self):
        admin_only_actions = {"create", "partial_update", "destroy", "update"}
        if self.action in admin_only_actions:
            return [IsAdminUser()]

        return [AllowAny()]


class CategoryListCreateView(
    OrderedListMixin,
    ListCreateAPIView,
):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CategoryDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.Category.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = serializers.CategorySerializer


class DashboardViewSet(ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"])
    def metrics(self, request):
        return Response(
            {
                "total_customers": User.objects.all().count(),
                "products": models.Product.objects.all().count(),
                "categories": models.Category.objects.all().count(),
                "variation_kinds": models.VariationKind.objects.all().count(),
                "variation_types": models.VariationType.objects.all().count(),
                "variation_options": models.VariationOption.objects.all().count(),
                "product_variations": models.ProductVariation.objects.all().count(),
            }
        )


class VariationKindsList(OrderedListMixin, ListCreateAPIView):
    queryset = models.VariationKind.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = serializers.VariationKindSerializer


class VariationKindsDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationKind.objects.all()
    serializer_class = serializers.VariationKindSerializer
    permission_classes = [IsAdminUser]


class VariationTypesList(OrderedListMixin, ListCreateAPIView):
    serializer_class = serializers.DashboardVariationTypeSerializer
    queryset = models.VariationType.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.VariationTypeCreateSerializer

        return super().get_serializer_class()


class VariationOptionsList(OrderedAdminListView):
    serializer_class = serializers.VariationOptionsListSerializer
    queryset = models.VariationOption.objects.all()


class ProductVariationList(OrderedAdminListView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = models.ProductVariation.objects.all()
