from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import Category, Product, VariationKind

User = get_user_model()


class ProductAPIEndpointsTestCase(APITestCase):
    def setUp(self):
        user = User.objects.create_superuser(
            email="test@example.com", first_name="Test", password="strongpassword"
        )
        refresh = RefreshToken.for_user(user)
        self.refresh_token = str(refresh)
        self.access_token = str(refresh.access_token)

        self.category = Category.objects.create(name="Accessories")
        self.product = Product.objects.create(
            category=self.category,
            name="Elegant Bracelet",
            base_price=1200,
            description="An elegant piece",
            details=["Shiny", "Polished"],
            materials=["Gold"],
            care=["Avoid water"],
        )
        self.variation_kind = VariationKind.objects.create(name="Metal")

    def assert_status_200(self, url_name, kwargs=None, is_admin=False):
        kwargs = kwargs or {}

        if is_admin:
            self.client.cookies["access_token"] = self.access_token

        url = reverse(url_name, kwargs=kwargs)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def assert_status_403(self, url_name, kwargs={}):
        url = reverse(url_name, kwargs=kwargs)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_metrics_returns_200_if_admin(self):
        self.assert_status_200("dashboard-metrics", is_admin=True)

    def test_dashboard_metrics_returns_403_if_not_admin(self):
        self.assert_status_403("dashboard-metrics")

    def test_products_list_returns_200(self):
        self.assert_status_200("products-list")

    def test_products_detail_returns_200(self):
        self.assert_status_200("products-detail", kwargs={"slug": self.product.slug})

    def test_categories_list_returns_200(self):
        self.assert_status_200("categories-list")

    def test_categories_detail_returns_200_if_admin(self):
        self.assert_status_200(
            "categories-detail", kwargs={"pk": self.category.pk}, is_admin=True
        )

    def test_categories_detail_returns_403_if_not_admin(self):
        self.assert_status_403("categories-detail", kwargs={"pk": self.category.pk})

    def test_variation_kinds_list_returns_200_if_admin(self):
        self.assert_status_200("variation-kinds-list", is_admin=True)

    def test_variation_kinds_list_returns_403_if_not_admin(self):
        self.assert_status_403("variation-kinds-list")

    def test_variation_kinds_detail_returns_200_if_admin(self):
        self.assert_status_200(
            "variation-kinds-detail", {"pk": self.variation_kind.pk}, is_admin=True
        )

    def test_variation_kinds_detail_returns_403_if_not_admin(self):
        self.assert_status_403("variation-kinds-detail", {"pk": self.variation_kind.pk})

    def test_variation_types_list_returns_200_if_admin(self):
        self.assert_status_200("variation-types-list", is_admin=True)

    def test_variation_types_list_returns_403_if_not_admin(self):
        self.assert_status_403("variation-types-list")

    def test_variation_options_list_returns_200_if_admin(self):
        self.assert_status_200("variation-options-list", is_admin=True)

    def test_variation_options_list_returns_403_if_not_admin(self):
        self.assert_status_403("variation-options-list")

    def test_product_variations_list_returns_200_if_admin(self):
        self.assert_status_200("product-variations-list", is_admin=True)

    def test_product_variations_list_returns_403_if_not_admin(self):
        self.assert_status_403("product-variations-list")
