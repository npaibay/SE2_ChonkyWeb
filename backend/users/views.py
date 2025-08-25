import json
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET

# Get your project’s user model (default: django.contrib.auth.models.User)
User = get_user_model()


def serialize_user(user: User):
    """Return JSON-safe representation of a user."""
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": bool(user.is_staff or user.is_superuser),
    }


@csrf_exempt
@require_POST
def login_view(request):
    """POST /api/login/ — authenticate user and start session."""
    try:
        data = json.loads(request.body.decode() or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not password or (not username and not email):
        return JsonResponse({"detail": "Missing credentials"}, status=400)

    # Allow login with email by mapping to username
    if not username and email:
        try:
            u = User.objects.get(email=email)
            username = u.username
        except User.DoesNotExist:
            return JsonResponse({"detail": "Invalid credentials"}, status=400)

    user = authenticate(request, username=username, password=password)
    if not user:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse(serialize_user(user))


@csrf_exempt
@require_POST
def logout_view(request):
    """POST /api/logout/ — end session."""
    logout(request)
    return JsonResponse({"detail": "Logged out"})


@require_GET
def me_view(request):
    """GET /api/me/ — get current logged-in user (if session active)."""
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Unauthorized"}, status=401)
    return JsonResponse(serialize_user(request.user))


@csrf_exempt
@require_POST
def update_password_view(request):
    """POST /api/update-password/ — change the logged-in user’s password."""
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body.decode() or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    old_pw = data.get("old_password")
    new_pw = data.get("new_password")
    if not old_pw or not new_pw:
        return JsonResponse({"detail": "Missing fields"}, status=400)

    if not request.user.check_password(old_pw):
        return JsonResponse({"detail": "Old password incorrect"}, status=400)

    request.user.set_password(new_pw)
    request.user.save()
    return JsonResponse({"detail": "Password updated"})


@csrf_exempt
@require_POST
def create_user_view(request):
    """POST /api/create-user/ — admin-only: create a new user."""
    if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({"detail": "Forbidden"}, status=403)

    try:
        data = json.loads(request.body.decode() or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return JsonResponse({"detail": "Missing fields"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"detail": "Username already exists"}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({"detail": "Email already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({"detail": "User created", "user": serialize_user(user)})


@csrf_exempt
@require_POST
def deactivate_user_view(request):
    """POST /api/deactivate-user/ — admin-only: disable a user account."""
    if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({"detail": "Forbidden"}, status=403)

    try:
        data = json.loads(request.body.decode() or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    target_username = data.get("username")
    if not target_username:
        return JsonResponse({"detail": "Missing username"}, status=400)

    try:
        target = User.objects.get(username=target_username)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=404)

    target.is_active = False
    target.save()
    return JsonResponse({"detail": f"User '{target_username}' deactivated"})
