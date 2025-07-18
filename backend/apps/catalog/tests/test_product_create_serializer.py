from rest_framework.test import APITestCase

from ..api.serializers import ProductCreateSerializer
from ..models import Category


class ProductCreateSerializerTestCase(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Accessories")
        self.valid_payload = {
            "category": self.category.pk,
            "name": "New Bracelet",
            "base_price": 1500,
            "description": "A stylish piece",
            "details": ["Shiny"],
            "materials": ["Gold"],
            "care": ["Keep dry"],
        }

    def assert_invalid(self, field, value):
        invalid_payload = self.valid_payload.copy()
        invalid_payload[field] = value

        serializer = ProductCreateSerializer(data=invalid_payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn(field, serializer.errors)

    def test_name_too_short(self):
        self.assert_invalid("name", "Short")

    def test_base_price_too_low(self):
        self.assert_invalid("base_price", 0.5)

    def test_details_is_empty(self):
        self.assert_invalid("details", [])

    def test_materials_is_empty(self):
        self.assert_invalid("materials", [])

    def test_care_is_empty(self):
        self.assert_invalid("care", [])

    def test_valid_creation(self):
        serializer = ProductCreateSerializer(data=self.valid_payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)
