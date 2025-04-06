from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


# Create your models here.
class CustomUser(AbstractUser):
    username = None  # Remove the username field
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"

    # Remove email from the required fields because it is now the USERNAME_FIELD
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.email
