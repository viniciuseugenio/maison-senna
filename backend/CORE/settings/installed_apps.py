DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
]

PROJECT_APPS = [
    "apps.accounts",
    "apps.catalog",
]


INSTALLED_APPS = DJANGO_APPS + PROJECT_APPS
