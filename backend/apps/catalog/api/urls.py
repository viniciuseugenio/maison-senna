from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"admin/dashboard", views.DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("products/", views.ProductView.as_view(), name="products_list"),
    path(
        "products/<slug:slug>/",
        views.ProductDetailsView.as_view(),
        name="product_details",
    ),
    path(
        "categories/",
        views.CategoryListView.as_view(),
        name="categories_list",
    ),
    path(
        "variation/kinds/",
        views.VariationKindsList.as_view(),
        name="variation_kinds_list",
    ),
    path(
        "variation/types/",
        views.VariationTypesList.as_view(),
        name="variation_types_list",
    ),
    path(
        "variation/options/",
        views.VariationOptionsList.as_view(),
        name="variation_options_list",
    ),
    path(
        "products_variations/",
        views.ProductVariationList.as_view(),
        name="product_variations_list",
    ),
]

urlpatterns += router.urls
