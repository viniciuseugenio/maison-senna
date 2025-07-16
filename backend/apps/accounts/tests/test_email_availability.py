from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class CheckEmailAvailabilityTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("check_email")
        self.existing_email = "test@example.com"
        self.user = User.objects.create_user(
            email=self.existing_email, password="strongpassword"
        )

    def test_email_exists_return_false(self):
        response = self.client.post(self.url, {"email": self.existing_email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["available"], False)

    def test_email_does_not_exist_return_true(self):
        response = self.client.post(self.url, {"email": "new@example.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["available"], True)

    def test_missing_email_returns_error(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
