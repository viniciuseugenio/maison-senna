from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView, Response

from .serializers import UserSerializer

User = get_user_model()


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
