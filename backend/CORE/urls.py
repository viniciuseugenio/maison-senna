"""
URL configuration for CORE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from apps.accounts.api.views import CustomTokenObtainPairView, CustomTokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/accounts/", include("apps.accounts.api.urls")),
    path(
        "api/v1/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/v1/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
