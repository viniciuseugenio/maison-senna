from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..api.constants import SERIALIZER_ERRORS

User = get_user_model()


class SignupViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("signup")

        self.valid_payload = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "strongpassword",
            "confirm_password": "strongpassword",
            "terms": True,
        }

    def test_successful_signup(self):
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.valid_payload["email"]))

    def test_password_mismatch(self):
        invalid_data = self.valid_payload.copy()
        invalid_data["confirm_password"] = "different_password"

        response = self.client.post(self.url, invalid_data)
        self.assertIn("confirm_password", response.data)
        self.assertEqual(
            response.data["confirm_password"][0], SERIALIZER_ERRORS["PASSWORD_MISMATCH"]
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        invalid_data = self.valid_payload.copy()

        invalid_data["password"] = invalid_data["confirm_password"] = "1234"
        response = self.client.post(self.url, invalid_data)

        self.assertIn("password", response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_first_last_name_equal(self):
        invalid_data = self.valid_payload.copy()
        invalid_data["last_name"] = invalid_data["first_name"]
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("last_name", response.data)

    def test_email_already_exists(self):
        User.objects.create_user(
            email="test@example.com",
            first_name="Existing",
            last_name="User",
            password="SomePass123",
        )

        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"][0], SERIALIZER_ERRORS["EMAIL_UNIQUE"])

    def test_terms_not_accepted(self):
        data = self.valid_payload.copy()
        data["terms"] = False
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("agree", response.data)
        self.assertEqual(response.data["agree"][0], SERIALIZER_ERRORS["BLANK_TERMS"])
