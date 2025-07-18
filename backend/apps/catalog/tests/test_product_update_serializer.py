from rest_framework.test import APITestCase

from apps.catalog.api.serializers import ProductUpdateSerializer

from ..models import Category, Product


class ProductUpdateSerializerTestCase(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Accessories")
        self.instance = Product.objects.create(
            category=self.category,
            name="Elegant Bracelet",
            base_price=1200,
            description="An elegant piece",
            details=["Shiny", "Polished"],
            materials=["Gold"],
            care=["Avoid water"],
        )

    def assert_invalid(self, data, field):
        serializer = ProductUpdateSerializer(
            data=data, instance=self.instance, partial=True
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn(field, serializer.errors)

    def test_name_too_short(self):
        self.assert_invalid({"name": "short"}, "name")

    def test_base_price_too_low(self):
        self.assert_invalid({"base_price": 0.5}, "base_price")

    def test_details_is_empty(self):
        self.assert_invalid({"details": []}, "details")

    def test_care_is_empty(self):
        self.assert_invalid({"care": []}, "care")

    def test_materials_is_empty(self):
        self.assert_invalid({"materials": []}, "materials")

    def test_valid_partial_update(self):
        data = {"name": "Updated Name", "base_price": 200, "care": ["Keep dry"]}
        serializer = ProductUpdateSerializer(
            instance=self.instance, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_no_fields_provided(self):
        serializer = ProductUpdateSerializer(
            instance=self.instance, data={}, partial=True
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
