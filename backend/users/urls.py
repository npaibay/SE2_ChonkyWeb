from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view),
    path("logout/", views.logout_view),
    path("me/", views.me_view),
    path("update-password/", views.update_password_view),
    path("create-user/", views.create_user_view),
    path("deactivate-user/", views.deactivate_user_view),
    path("logs/", views.logs_view),
]
