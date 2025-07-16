from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class MeViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("me_view")
        self.user = User.objects.create_user(
            email="test@example.com", password="strongpassword"
        )

        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.refresh_token = str(self.refresh)

    def test_authenticated_user_receives_data(self):
        self.client.cookies["access_token"] = self.access_token

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.data)

    def test_unauthenticated_user_gets_400(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
