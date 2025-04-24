from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.SignupView.as_view(), name="signup"),
    path("check-email/", views.CheckEmailAvailability.as_view(), name="check_email"),
]
