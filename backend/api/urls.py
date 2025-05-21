from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", include("accounts.urls")),
    path("email-confirm/<str:token>/", views.email_confirm, name="email-confirm"),
    path("contacts/", include("contacts.urls")),
    path("chats/", include("chats.urls")),
    path("messages/", include("messaging.urls")),
    path("google-tokens/", views.exchange_code_for_tokens),
]
