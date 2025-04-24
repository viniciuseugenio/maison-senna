from rest_framework import serializers
from ..models import CustomUser
from .constants import SERIALIZER_ERRORS


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """

    email = serializers.EmailField(
        error_messages={
            "blank": SERIALIZER_ERRORS["BLANK_EMAIL"],
        },
    )

    password = serializers.CharField(
        write_only=True,
        error_messages={"min_length": SERIALIZER_ERRORS["PASSWORD_LENGTH"]},
    )
    confirm_password = serializers.CharField(
        write_only=True,
    )
    terms = serializers.BooleanField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "terms",
        ]
        extra_kwargs = {
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, data):
        errors = {}

        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        terms = data.get("terms")

        if CustomUser.objects.filter(email=email).exists():
            errors["email"] = SERIALIZER_ERRORS["EMAIL_UNIQUE"]

        if len(password) < 8:
            errors["password"] = SERIALIZER_ERRORS["PASSWORD_LENGTH"]

        if first_name == last_name:
            errors["last_name"] = [SERIALIZER_ERRORS["FIRST_LAST_NAME_EQUAL"]]

        if password != confirm_password:
            errors["confirm_password"] = [SERIALIZER_ERRORS["PASSWORD_MISMATCH"]]

        if not terms:
            errors["agree"] = [SERIALIZER_ERRORS["BLANK_TERMS"]]

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        validated_data.pop("terms")

        user = CustomUser.objects.create_user(**validated_data)
        return user
