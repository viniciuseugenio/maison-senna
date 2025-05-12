from datetime import timedelta

from apps.accounts.api.responses import get_success_message
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .api.serializers import UserShortSerializer


def get_max_age(key):
    lifetime: timedelta = settings.SIMPLE_JWT[key]
    max_age = int(lifetime.total_seconds())

    return max_age


def generate_token_response(
    user,
    messages,
    extra_data=None,
):
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    access_max_age = get_max_age("ACCESS_TOKEN_LIFETIME")
    refresh_max_age = get_max_age("REFRESH_TOKEN_LIFETIME")

    response_data = {
        **messages,
        "user": UserShortSerializer(user).data,
    }

    if extra_data:
        response_data.update(extra_data)

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
