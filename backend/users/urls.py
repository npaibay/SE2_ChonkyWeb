from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    TokenObtainView, MeView, UpdatePasswordView, CreateUserView, DeactivateUserView,
    LogsView, LogoutView, UsersListView, UpdateRoleView,
)

urlpatterns = [
    # Auth (custom obtain that supports email OR username)
    path("token/", TokenObtainView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # Profile / session
    path("me/", MeView.as_view(), name="me"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("update-password/", UpdatePasswordView.as_view(), name="update_password"),

    # Admin actions
    path("create-user/", CreateUserView.as_view(), name="create_user"),
    path("deactivate-user/", DeactivateUserView.as_view(), name="deactivate_user"),
    path("logs/", LogsView.as_view(), name="logs"),
    path("users/", UsersListView.as_view(), name="users_list"),
    path("update-role/", UpdateRoleView.as_view(), name="update_role"),
]
