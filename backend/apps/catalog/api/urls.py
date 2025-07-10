from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register(r"admin/dashboard", views.DashboardViewSet, basename="dashboard")
router.register("products", views.ProductViewSet, basename="products")

urlpatterns = [
    path(
        "categories/",
        views.CategoryListCreateView.as_view(),
        name="categories_list",
    ),
    path(
        "categories/<int:pk>/",
        views.CategoryDetailsView.as_view(),
        name="categories_details",
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
