from rest_framework.authentication import BaseAuthentication


class JWTAuthentication(BaseAuthentication):
    def get(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        if access_token:
            return self._validate_with_access_token()

        if refresh_token:
            return self._validate_with_refresh_token()

    def _validate_with_access_token(self, token):
        pass

    def _validate_with_refresh_token(self, token):
        pass
