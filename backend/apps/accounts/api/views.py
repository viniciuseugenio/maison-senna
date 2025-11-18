from datetime import timedelta

import requests
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from environ import Env
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import serializers, status
from rest_framework.exceptions import NotAuthenticated, ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView, Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.utils import generate_token_response

from .responses import get_error_message, get_success_message
from .serializers import UserSerializer, UserShortSerializer

User = get_user_model()
env = Env()


class CustomTokenObtainPairView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                get_error_message("INCORRECT_CREDENTIALS"),
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return generate_token_response(
            user, get_success_message("LOGIN", user.first_name)
        )


class CustomTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh["user_id"]

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"detail": "User not found for the provided token"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
                raise NotAuthenticated()

            access_token = str(refresh.access_token)

            response = Response(
                UserShortSerializer(user).data, status=status.HTTP_200_OK
            )
            response.set_cookie(
                "access_token",
                access_token,
                self._get_max_age("ACCESS_TOKEN_LIFETIME"),
                httponly=True,
            )

            return response
        except (TokenError, InvalidToken):
            return Response(
                {"detail": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def _get_max_age(self, key):
        lifetime: timedelta = settings.SIMPLE_JWT[key]
        max_age = int(lifetime.total_seconds())

        return max_age


class GoogleAuthManualView(APIView):
    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response(
                {"detail": "Missing code"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token_data = self._exchange_code_for_tokens(code)
            id_info = self._verify_id_token(token_data["id_token"])
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        email = id_info.get("email")
        first_name = id_info.get("given_name")
        last_name = id_info.get("family_name")

        user = User.objects.filter(email=email)
        if user.exists():
            return generate_token_response(
                user.first(), get_success_message("LOGIN", first_name)
            )

        else:
            user = User.objects.create_user(
                email=email, first_name=first_name, last_name=last_name
            )
            return generate_token_response(user, get_success_message("SIGNUP_SOCIAL"))

    def _exchange_code_for_tokens(self, auth_code):
        data = {
            "code": auth_code,
            "client_id": env("CLIENT_ID"),
            "client_secret": env("CLIENT_SECRET"),
            "redirect_uri": env("FRONTEND_URL"),
            "grant_type": "authorization_code",
        }

        response = requests.post("https://oauth2.googleapis.com/token", data=data)
        return response.json()

    def _verify_id_token(self, id_token_str):
        id_info = id_token.verify_oauth2_token(
            id_token_str, google_requests.Request(), env("CLIENT_ID")
        )
        return id_info


class LogoutView(APIView):
    def post(self, request):
        response = Response(get_success_message("LOGOUT"), status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class SignupView(CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            raise ValidationError(serializer.errors)

        serializer.save()

        return Response(
            get_success_message("SIGNUP"),
            status=status.HTTP_201_CREATED,
        )


class CheckEmailAvailability(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response({"available": False}, status=status.HTTP_200_OK)

        return Response({"available": True}, status=status.HTTP_200_OK)


class MeView(APIView):
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = request.user
        return Response(UserShortSerializer(user).data)


class PasswordRequestResetView(APIView):
    def post(self, request):
        success_response_data = get_success_message("PASSWORD_REQUEST_RESET")

        email = request.data.get("email")
        if not email:
            return Response(
                get_error_message("PASSWORD_RESET_INVALID"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(success_response_data, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        front_url = env("FRONTEND_URL")
        reset_link = f"{front_url}/reset-password?uid={uid}&token={token}"

        send_mail(
            "Reset your password",
            f"Click the link to reset your password: {reset_link}",
            settings.EMAIL_HOST_USER,
            [user.email],
        )

        return Response(success_response_data)


class PasswordResetConfirmView(APIView):
    class InputSerializer(serializers.Serializer):
        uid = serializers.CharField()
        token = serializers.CharField()
        new_password = serializers.CharField(min_length=8)

    def get_serializer(self, *args, **kwargs):
        return self.InputSerializer(*args, **kwargs)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                get_error_message("PASSWORD_RESET_CONFIRM"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                get_error_message("PASSWORD_RESET_USER_ID"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                get_error_message("PASSWORD_RESET_TOKEN"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            get_success_message("PASSWORD_RESET"),
            status=status.HTTP_200_OK,
        )
