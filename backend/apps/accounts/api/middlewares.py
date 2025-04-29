import environ
import jwt
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication

env = environ.Env()
User = get_user_model()


class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if access_token:
            try:
                decoded = jwt.decode(
                    access_token.encode(), env("SECRET_KEY"), algorithms=["HS256"]
                )
                user_id = decoded["user_id"]
                user = User.objects.get(id=user_id)
                return (user, None)

            except jwt.exceptions.InvalidTokenError:
                return None

        return None
