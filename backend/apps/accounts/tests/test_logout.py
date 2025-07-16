from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class LogoutViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("logout_view")
        self.user = User.objects.create_user(
            email="test@example.com",
            password="strongpassword",
            first_name="Test",
            last_name="User",
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)

    def test_logout_unauthenticated_user(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_authenticated_user(self):
        self.client.cookies["access_token"] = self.access_token
        self.client.cookies["refresh_token"] = self.refresh_token

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["refresh_token"].value, "")
