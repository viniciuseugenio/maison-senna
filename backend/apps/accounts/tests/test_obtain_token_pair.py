from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class ObtainTokenPairAPITestCase(APITestCase):
    def setUp(self):
        self.password = "TestStrongPassword123"
        self.user = User.objects.create_user(
            email="test@example.com",
            password=self.password,
            first_name="Vinicius",
            last_name="Eugenio",
        )

    def test_login_success(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(
            url,
            {
                "email": "test@example.com",
                "password": self.password,
            },
            format="json",
        )

        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_wrong_password(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(
            url,
            {"email": "test@example.com", "password": f"123{self.password}"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_email(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(
            url, {"email": "nonexistent@example.com", "password": self.password}
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(url, {"email": "", "password": ""})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
