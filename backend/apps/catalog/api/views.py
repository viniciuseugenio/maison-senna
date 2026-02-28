import json

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from djangorestframework_camel_case.util import underscoreize
from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import (
    AllowAny,
    BasePermission,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from apps.catalog.api.serializers.category import CategoryWProductsSerializer

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
    queryset = models.Product.objects.select_related("category")
    lookup_field = "slug"
    filter_backends = [filters.OrderingFilter]
    ordering = ["-id"]

    def get_queryset(self):
        if self.action == "retrieve":
            return models.Product.objects.select_related("category").prefetch_related(
                "variation_options__kind"
            )

        return super().get_queryset()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.ProductSerializer

        if self.action == "create":
            return serializers.ProductCreateSerializer

        if self.action == "partial_update":
            return serializers.ProductUpdateSerializer

        return serializers.ProductListSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        product_name = response.data.get("name") or "The product"

        return Response(
            {
                "detail": "Product created",
                "description": f"{product_name} is now live at your store",
                "product": response.data,
            },
            status=status.HTTP_201_CREATED,
            headers=response.headers,
        )

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        product_name = response.data.get("name") or "The product"

        return Response(
            {
                "detail": "Product updated",
                "description": f"{product_name} has been successfully updated",
                "product": response.data,
            },
            status=status.HTTP_200_OK,
        )

    @action(["get"], detail=False)
    def featured(self, request):
        queryset = self.queryset.filter(is_featured=True)
        serializer = serializers.ProductListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(["get"], detail=False)
    def search(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response([], status=status.HTTP_200_OK)

        queryset = self.queryset.filter(
            Q(name__icontains=query)
            | Q(description__icontains=query)
            | Q(category__name__icontains=query)
        ).distinct()

        serializer = serializers.ProductListSerializer(
            queryset, many=True, context={"request": request}
        )

        return Response(serializer.data)

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
    pagination_class = None


class CategoryDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAdminUser()]

    def get(self, request, *args, **kwargs):
        get_products = request.query_params.get("products")

        if get_products:
            category = self.get_object()
            return Response(
                CategoryWProductsSerializer(
                    category, context={"request": request}
                ).data,
                status=status.HTTP_200_OK,
            )

        return super().get(request, *args, **kwargs)


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
                "variation_options": models.VariationOption.objects.all().count(),
                "product_variations": models.ProductVariation.objects.all().count(),
            }
        )


class VariationKindsList(OrderedListMixin, ListCreateAPIView):
    queryset = models.VariationKind.objects.all()
    permission_classes = [IsAuthenticatedUserAdmin]
    serializer_class = serializers.VariationKindSerializer
    pagination_class = None


class VariationKindsDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationKind.objects.all()
    serializer_class = serializers.VariationKindSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "pk"


class VariationOptionsList(OrderedAdminListView):
    serializer_class = serializers.VariationOptionSerializer
    queryset = models.VariationOption.objects.all()


class VariationOptionRUDView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationOption.objects.all()
    serializer_class = serializers.VariationOptionEditSerializer
    lookup_field = "pk"

    def patch(self, request, *args, **kwargs):
        response = super().patch(request, *args, **kwargs)
        return Response(
            {
                "detail": "The option was successfully updated!",
                "option": response.data,
            }
        )

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        super().delete(request, *args, **kwargs)
        return Response(
            {"detail": f"The option {instance.name} was successfully deleted"},
            status=status.HTTP_200_OK,
        )


class ProductVariationList(OrderedAdminListView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = models.ProductVariation.objects.all()


class WishlistViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = models.WishlistItem.objects.filter(user=self.request.user)

        limit = self.request.GET.get("limit")
        if limit:
            try:
                limit = int(limit)
                queryset = queryset[0:limit]
            except ValueError:
                pass

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.WishlistItemCreateSerializer

        return serializers.WishlistItemSerializer

    @action(
        detail=False, methods=["delete"], url_path="by-product/(?P<product_id>[0-9]+)"
    )
    def delete_by_product(self, request, product_id=None):
        try:
            wishlist_item = models.WishlistItem.objects.get(
                user=request.user, product_id=product_id
            )
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except models.WishlistItem.DoesNotExist:
            return Response(
                {
                    "detail": "Item not in your wishlist",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
