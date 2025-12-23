from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import (
    AllowAny,
    BasePermission,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from .. import models
from . import serializers

User = get_user_model()


class IsAuthenticatedUserAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")

        return True


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        product_name = serializer.data.get("name", "Product")

        return Response(
            {
                "detail": "Product created",
                "description": f"{product_name} is now live at your store",
                "product": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

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
    permission_classes = [IsAuthenticatedUserAdmin]
    serializer_class = serializers.VariationKindSerializer


class VariationKindsDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationKind.objects.all()
    serializer_class = serializers.VariationKindSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "pk"


class VariationTypesList(OrderedListMixin, ListCreateAPIView):
    serializer_class = serializers.DashboardVariationTypeSerializer
    queryset = models.VariationType.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.VariationTypeCreateSerializer

        return super().get_serializer_class()


class VariationTypesDetail(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationType.objects.all()
    serializer_class = serializers.VariationTypeSerializer
    permission_classes = [IsAdminUser]


class VariationOptionsList(OrderedAdminListView):
    serializer_class = serializers.VariationOptionsListSerializer
    queryset = models.VariationOption.objects.all()


class ProductVariationList(OrderedAdminListView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = models.ProductVariation.objects.all()
