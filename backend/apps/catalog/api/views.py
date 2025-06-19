from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from .. import models
from . import serializers

User = get_user_model()


class OrderedListView(ListAPIView):
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]


class ProductView(ListCreateAPIView):
    queryset = models.Product.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]

    serializer_class = serializers.ProductListSerializer

    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.ProductCreateSerializer

        return serializers.ProductListSerializer


class ProductDetailsView(RetrieveAPIView):
    queryset = models.Product.objects.all().order_by("-id")
    serializer_class = serializers.ProductSerializer
    lookup_field = "slug"


class CategoryListView(OrderedListView):
    queryset = models.Category.objects.all().order_by("-id")
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


class VariationKindsList(OrderedListView):
    serializer_class = serializers.VariationKindSerializer
    queryset = models.VariationKind.objects.all()


class VariationTypesList(OrderedListView):
    serializer_class = serializers.DashboardVariationTypeSerializer
    queryset = models.VariationType.objects.all()


class VariationOptionsList(OrderedListView):
    serializer_class = serializers.VariationOptionsListSerializer
    queryset = models.VariationOption.objects.all()


class ProductVariationList(OrderedListView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = models.ProductVariation.objects.all()
