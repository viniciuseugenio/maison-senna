from django.contrib.auth import get_user_model
from django.core import mail
from django.urls.base import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.api.responses import get_error_message, get_success_message

User = get_user_model()


class PasswordRequestResetTestCase(APITestCase):
    def setUp(self):
        self.user_email = "test@example.com"
        self.user = User.objects.create_user(
            email=self.user_email, password="strongpassword"
        )
        self.url = reverse("request_password_reset")

    def test_password_reset_request_valid_user_sends_email(self):
        response = self.client.post(self.url, {"email": self.user_email})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, get_success_message("PASSWORD_REQUEST_RESET"))

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Reset your password")
        self.assertIn(self.user_email, mail.outbox[0].to)

    def test_password_reset_request_invalid_user_does_not_send_email(self):
        response = self.client.post(self.url, {"email": "ghost@example.com"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, get_success_message("PASSWORD_REQUEST_RESET"))

        self.assertEqual(len(mail.outbox), 0)

    def test_password_reset_request_missing_email_returns_400(self):
        response = self.client.post(self.url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            get_error_message("PASSWORD_RESET_INVALID"),
        )
