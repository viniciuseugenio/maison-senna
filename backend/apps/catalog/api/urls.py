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
        name="categories-list",
    ),
    path(
        "categories/<int:pk>/",
        views.CategoryDetailsView.as_view(),
        name="categories-detail",
    ),
    path(
        "variation/kinds/",
        views.VariationKindsList.as_view(),
        name="variation-kinds-list",
    ),
    path(
        "variation/kinds/<int:pk>/",
        views.VariationKindsDetailsView.as_view(),
        name="variation-kinds-detail",
    ),
    path(
        "variation/types/",
        views.VariationTypesList.as_view(),
        name="variation-types-list",
    ),
    path(
        "variation/options/",
        views.VariationOptionsList.as_view(),
        name="variation-options-list",
    ),
    path(
        "products_variations/",
        views.ProductVariationList.as_view(),
        name="product-variations-list",
    ),
]

urlpatterns += router.urls
