from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import TokenObtainView, MeView, UpdatePasswordView, CreateUserView, DeactivateUserView, LogsView
from .views import LogoutView

urlpatterns = [
    path("token/", TokenObtainView.as_view(), name="token_obtain_pair"),  # ✅ clean login
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    path("me/", MeView.as_view(), name="me"),
    path("update-password/", UpdatePasswordView.as_view(), name="update_password"),
    path("create-user/", CreateUserView.as_view(), name="create_user"),
    path("deactivate-user/", DeactivateUserView.as_view(), name="deactivate_user"),
    path("logs/", LogsView.as_view(), name="logs"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
