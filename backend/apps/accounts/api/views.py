from datetime import timedelta

import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from environ import Env
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

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        access_max_age = self._get_max_age("ACCESS_TOKEN_LIFETIME")
        refresh_max_age = self._get_max_age("REFRESH_TOKEN_LIFETIME")

        response_data = {
            "detail": "Welcome back!",
            "user": UserShortSerializer(user).data,
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=access_max_age,
            secure=False,  # TODO: Set to True in
            httponly=True,
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=refresh_max_age,
            httponly=True,
        )

        return response

    def _get_max_age(self, key):
        lifetime: timedelta = settings.SIMPLE_JWT[key]
        max_age = int(lifetime.total_seconds())

        return max_age


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
