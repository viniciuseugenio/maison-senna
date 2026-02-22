import environ
import jwt
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

env = environ.Env()
User = get_user_model()


class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None

        try:
            decoded = jwt.decode(access_token, env("SECRET_KEY"), algorithms=["HS256"])
            user_id = decoded["user_id"]
            user = User.objects.get(id=user_id)
            return (user, None)

        except jwt.exceptions.InvalidTokenError:
            return None

        except User.DoesNotExist:
            raise AuthenticationFailed("User not found.")

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
