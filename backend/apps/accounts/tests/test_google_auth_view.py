from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class GoogleAuthManualViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("google_login")  # Update with actual path name
        self.existing_user = User.objects.create_user(
            email="test@example.com", first_name="Test", last_name="User"
        )

    def test_missing_code_returns_400(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Missing code")

    @patch("apps.accounts.api.views.GoogleAuthManualView._exchange_code_for_tokens")
    def test_code_exchange_failure(self, mock_exchange_code):
        exception_message = "Token exchange failed"
        mock_exchange_code.side_effect = Exception(exception_message)

        response = self.client.post(self.url, {"code": "Invalid code"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], exception_message)

    @patch("apps.accounts.api.views.GoogleAuthManualView._exchange_code_for_tokens")
    @patch("apps.accounts.api.views.GoogleAuthManualView._verify_id_token")
    def test_verify_id_token_failure(self, mock_verify_id, mock_exchange_code):
        mock_exchange_code.return_value = {"id_token": "valid.fake.token"}

        exception_message = "ID token verification failed"
        mock_verify_id.side_effect = Exception(exception_message)

        response = self.client.post(self.url, {"code": "Invalid code"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], exception_message)

    @patch("apps.accounts.api.views.GoogleAuthManualView._exchange_code_for_tokens")
    @patch("apps.accounts.api.views.GoogleAuthManualView._verify_id_token")
    def test_user_logins_with_correct_code(self, mock_verify_id, mock_exchange_code):
        mock_exchange_code.return_value = {"id_token": "valid.fake.token"}
        mock_verify_id.return_value = {
            "email": self.existing_user.email,
            "given_name": self.existing_user.first_name,
            "family_name": self.existing_user.last_name,
        }

        response = self.client.post(self.url, {"code": "valid_code"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data)

        # Make sure authentication tokens are set
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    @patch("apps.accounts.api.views.GoogleAuthManualView._exchange_code_for_tokens")
    @patch("apps.accounts.api.views.GoogleAuthManualView._verify_id_token")
    def test_user_signs_up_with_correct_code(self, mock_verify_id, mock_exchange_code):
        mock_exchange_code.return_value = {"id_token": "valid.fake.token"}
        mock_verify_id.return_value = {
            "email": "newuser@example.com",
            "given_name": "New",
            "family_name": "User",
        }

        response = self.client.post(self.url, {"code": "valid_code"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Welcome", response.data["detail"])
        self.assertIn("user", response.data)

        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

        self.assertTrue(User.objects.filter(email=mock_verify_id.return_value["email"]))
