from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.api.responses import get_error_message, get_success_message

User = get_user_model()


class PasswordResetConfirmTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="strongpassword"
        )

        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = default_token_generator.make_token(self.user)
        self.valid_payload = {
            "uid": self.uid,
            "token": self.token,
            "new_password": "newstrongpassword",
        }

        self.url = reverse("reset_password")

    def test_valid_reset(self):
        response = self.client.post(self.url, self.valid_payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, get_success_message("PASSWORD_RESET"))

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.valid_payload["new_password"]))

    def test_invalid_token(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload["token"] = "invalid-token"

        response = self.client.post(self.url, invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            get_error_message("PASSWORD_RESET_TOKEN"),
        )

    def test_invalid_uid(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload["uid"] = "invalid-uid"

        response = self.client.post(self.url, invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            get_error_message("PASSWORD_RESET_USER_ID"),
        )

    def test_missing_fields(self):
        invalid_payload = self.valid_payload.copy()
        del invalid_payload["new_password"]

        response = self.client.post(self.url, invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_error_message("PASSWORD_RESET_CONFIRM"))

    def test_short_password(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload["new_password"] = "short"

        response = self.client.post(self.url, invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, get_error_message("PASSWORD_RESET_CONFIRM"))
