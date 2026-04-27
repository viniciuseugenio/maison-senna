from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.db.models import Count, Prefetch, Q
from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.generics import (
    GenericAPIView,
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

from apps.catalog.services.product import save_product_and_sync_options

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
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ["name", "description", "category__name"]
    ordering = ["-id"]

    def perform_create(self, serializer):
        serializer.instance = save_product_and_sync_options(serializer.validated_data)

    def perform_update(self, serializer):
        serializer.instance = save_product_and_sync_options(
            serializer.validated_data, serializer.instance
        )

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == "retrieve":
            return queryset.prefetch_related("variation_options__kind")

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.ProductSerializer

        if self.action in ["create", "partial_update"]:
            return serializers.ProductWriteSerializer

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

    def get_paginated_response(self, data):
        if self.request.query_params.get("paginate") == "false":
            return Response(data)

        return super().get_paginated_response(data)


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
                serializers.CategoryWProductsSerializer(
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

    def get_paginated_response(self, data):
        if self.request.query_params.get("paginate") == "false":
            return Response(data)

        return super().get_paginated_response(data)


class VariationKindsDetailsView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationKind.objects.all()
    serializer_class = serializers.VariationKindSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "pk"


class VariationOptionsList(OrderedAdminListView):
    serializer_class = serializers.VariationOptionSerializer
    queryset = models.VariationOption.objects.select_related("kind", "product")


class VariationOptionRUDView(RetrieveUpdateDestroyAPIView):
    queryset = models.VariationOption.objects.select_related("kind", "product")
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
    serializer_class = serializers.ProductWithVariationOptions
    queryset = models.Product.objects.prefetch_related(
        Prefetch(
            "variations",
            queryset=models.ProductVariation.objects.filter(is_active=True),
        )
    )


class ProductVariationDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = (
        models.ProductVariation.objects.select_related("product")
        .prefetch_related("options")
        .filter(is_active=True)
    )
    lookup_field = "pk"


class ProductVariationByOptionsView(GenericAPIView):
    serializer_class = serializers.ProductVariationSerializer
    queryset = (
        models.ProductVariation.objects.filter(is_active=True)
        .select_related("product")
        .prefetch_related("options")
    )

    def get_object(self):
        qs = super().get_queryset()
        product_id = self.kwargs.get("pk")
        serializer = serializers.OptionsListSerializer(
            data={"options": self.request.query_params.getlist("options")}
        )
        serializer.is_valid(raise_exception=True)
        options = serializer.validated_data["options"]

        qs = qs.filter(product__pk=product_id)
        variation = (
            qs.annotate(
                total_options=Count("options", distinct=True),
                matched_options=Count(
                    "options",
                    filter=Q(options__id__in=options),
                ),
            )
            .filter(total_options=len(options), matched_options=len(options))
            .first()
        )

        return variation

    def get(self, *args, **kwargs):
        variation = self.get_object()

        if not variation:
            return Response(
                {"detail": "No product variation with the passed IDs were found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(variation)
        return Response(serializer.data)


class WishlistViewSet(ModelViewSet):
    queryset = models.WishlistItem.objects.select_related("user", "product__category")
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset().filter(user=self.request.user)
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
            wishlist_item = self.queryset.get(user=request.user, product_id=product_id)
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except models.WishlistItem.DoesNotExist:
            return Response(
                {
                    "detail": "Item not in your wishlist",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
