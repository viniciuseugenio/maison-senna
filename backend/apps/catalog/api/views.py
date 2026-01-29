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

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.ProductSerializer

        if self.action == "create":
            return serializers.ProductCreateSerializer

        if self.action == "partial_update":
            return serializers.ProductUpdateSerializer

        return serializers.ProductListSerializer

    def _parse_request_data(self, data):
        data = dict(data)

        for key, value in data.items():
            if isinstance(value, list) and len(value) == 1:
                data[key] = value[0]

        json_fields = ["details", "materials", "care", "variation_options"]
        for field in json_fields:
            if field in data and isinstance(data[field], str):
                try:
                    parsed = json.loads(data[field])
                    data[field] = underscoreize(parsed)
                except json.JSONDecodeError:
                    pass

        return data

    def create(self, request, *args, **kwargs):
        data = self._parse_request_data(request.data)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        output_serializer = serializers.ProductSerializer(instance)
        output_data = output_serializer.data

        headers = self.get_success_headers(output_data)
        product_name = output_serializer.data.get("name", "Product")

        return Response(
            {
                "detail": "Product created",
                "description": f"{product_name} is now live at your store",
                "product": output_data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def partial_update(self, request, *args, **kwargs):
        data = self._parse_request_data(request.data)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        output_serializer = serializers.ProductSerializer(instance)
        output_data = output_serializer.data
        product_name = output_serializer.data.get("name", "Product")

        return Response(
            {
                "detail": "Product updated",
                "description": f"{product_name} has been successfully updated",
                "product": output_data,
            },
            status=status.HTTP_200_OK,
        )

    @action(["get"], detail=False)
    def featured(self, request):
        queryset = models.Product.objects.filter(is_featured=True)
        serializer = serializers.ProductListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(["get"], detail=False)
    def search(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response([], status=status.HTTP_200_OK)

        queryset = models.Product.objects.filter(
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
