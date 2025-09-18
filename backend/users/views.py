from django.contrib.auth import get_user_model, authenticate
from rest_framework import permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .models import SecurityLog

User = get_user_model()


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def serialize_user(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": bool(user.is_staff or user.is_superuser),
    }


# =============================
# JWT login: email OR username
# =============================
class TokenObtainView(APIView):
    permission_classes = [permissions.AllowAny]

    class InputSerializer(serializers.Serializer):
        identifier = serializers.CharField()
        password = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["identifier"]
        password = serializer.validated_data["password"]

        # resolve identifier → username if it's an email
        username_value = identifier
        try:
            u = User.objects.get(email__iexact=identifier)
            username_value = u.username
        except User.DoesNotExist:
            pass

        user = authenticate(username=username_value, password=password)
        if not user:
            SecurityLog.objects.create(
                user=None, action="FAILED_LOGIN", ip_address=get_client_ip(request)
            )
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Inactive account"}, status=status.HTTP_403_FORBIDDEN)

        # issue tokens
        refresh = RefreshToken.for_user(user)
        refresh["username"] = user.username
        refresh["email"] = user.email
        refresh["is_admin"] = bool(user.is_staff or user.is_superuser)

        SecurityLog.objects.create(user=user, action="LOGIN", ip_address=get_client_ip(request))

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


# =============================
# Logout (blacklist refresh)
# =============================
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"detail": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # ✅ mark as invalid
            SecurityLog.objects.create(user=request.user, action="LOGOUT", ip_address=get_client_ip(request))
            return Response({"detail": "Logged out successfully"})
        except (TokenError, InvalidToken):
            return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)


# =============================
# Protected endpoints
# =============================
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(serialize_user(request.user))


class UpdatePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        old_pw = request.data.get("old_password")
        new_pw = request.data.get("new_password")

        if not old_pw or not new_pw:
            return Response({"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(old_pw):
            return Response({"detail": "Old password incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_pw)
        request.user.save()

        SecurityLog.objects.create(user=request.user, action="PASSWORD_CHANGE", ip_address=get_client_ip(request))

        return Response({"detail": "Password updated"})


class CreateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)

        SecurityLog.objects.create(user=request.user, action="CREATE_USER", ip_address=get_client_ip(request))

        return Response({"detail": "User created", "user": serialize_user(user)}, status=status.HTTP_201_CREATED)


class DeactivateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        target_username = request.data.get("username")
        if not target_username:
            return Response({"detail": "Missing username"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target = User.objects.get(username=target_username)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        target.is_active = False
        target.save()

        SecurityLog.objects.create(user=request.user, action="DEACTIVATE_USER", ip_address=get_client_ip(request))

        return Response({"detail": f"User '{target_username}' deactivated"})


class LogsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        logs = SecurityLog.objects.select_related("user").order_by("-timestamp")[:50]
        data = [
            {
                "user": log.user.username if log.user else "Unknown",
                "action": log.action,
                "timestamp": log.timestamp.isoformat(),
                "ip": log.ip_address,
            }
            for log in logs
        ]
        return Response(data)

# --- NEW: list users and update roles (admin only) ---
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status

class UsersListView(APIView):
    # must be authenticated AND admin to list users
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        qs = User.objects.all().order_by("username")
        data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "is_staff": u.is_staff,
                "is_superuser": u.is_superuser,
            }
            for u in qs
        ]
        return Response(data, status=200)


class UpdateRoleView(APIView):
    # only admins can change roles
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        username = request.data.get("username")
        is_staff = bool(request.data.get("is_staff"))
        is_superuser = bool(request.data.get("is_superuser"))

        if not username:
            return Response({"detail": "Missing username"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.save()

        return Response({"detail": "Roles updated successfully."}, status=status.HTTP_200_OK)
