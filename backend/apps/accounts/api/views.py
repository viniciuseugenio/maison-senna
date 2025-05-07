from datetime import timedelta

import requests
from apps.accounts.utils import generate_token_response
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from environ import Env
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    ValidationError,
)
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView, Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, UserShortSerializer

User = get_user_model()
env = Env()


class CustomTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid email or password.")

        return generate_token_response(user)


class CustomTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise NotAuthenticated()

        refresh = RefreshToken(refresh_token)
        user_id = refresh["user_id"]
        user = User.objects.get(id=user_id)

        access_token = str(refresh.access_token)

        response = Response(UserShortSerializer(user).data, status=status.HTTP_200_OK)
        response.set_cookie(
            "access_token",
            access_token,
            self._get_max_age("ACCESS_TOKEN_LIFETIME"),
            httponly=True,
        )

        return response

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
            return generate_token_response(user.first(), extra_data={"type": "login"})

        else:
            user = User.objects.create_user(
                email=email, first_name=first_name, last_name=last_name
            )
            return generate_token_response(user, extra_data={"type": "register"})

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
        response = Response({"detail": "You've Signed Out"}, status=status.HTTP_200_OK)
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
            {"detail": "User created successfully"}, status=status.HTTP_201_CREATED
        )


class CheckEmailAvailability(APIView):
    def post(self, request):
        email = request.data.get("email")

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
