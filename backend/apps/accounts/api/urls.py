from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.SignupView.as_view(), name="signup"),
    path("check-email/", views.CheckEmailAvailability.as_view(), name="check_email"),
    path("me/", views.MeView.as_view(), name="me_view"),
    path("logout/", views.LogoutView.as_view(), name="logout_view"),
    path("auth/google/", views.GoogleAuthManualView.as_view(), name="google_login"),
    path(
        "request-password-reset/",
        views.PasswordRequestResetView.as_view(),
        name="request_password_reset",
    ),
    path(
        "reset-password/",
        views.PasswordResetConfirmView.as_view(),
        name="reset_password",
    ),
]
