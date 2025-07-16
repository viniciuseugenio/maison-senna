from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class TokenRefreshAPITestCase(APITestCase):
    def setUp(self):
        self.password = "TestStrongPassword123"
        self.user = User.objects.create_user(
            email="test@example.com",
            password=self.password,
            first_name="Vinicius",
            last_name="Eugenio",
        )

        self.refresh = RefreshToken.for_user(self.user)
        self.refresh_token = str(self.refresh)

    def test_refresh_success(self):
        self.client.cookies["refresh_token"] = self.refresh_token
        url = reverse("token_refresh")
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("access_token", response.cookies)
        self.assertIn("id", response.data)

    def test_missing_refresh_token(self):
        url = reverse("token_refresh")
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_existent_user(self):
        self.client.cookies["refresh_token"] = self.refresh_token
        self.user.delete()
        url = reverse("token_refresh")
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_refresh_token(self):
        self.client.cookies["refresh_token"] = "invalid.token.value"
        url = reverse("token_refresh")
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
