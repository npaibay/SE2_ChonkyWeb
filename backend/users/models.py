from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SecurityLog(models.Model):
    ACTIONS = [
        ("LOGIN", "Login"),
        ("LOGOUT", "Logout"),
        ("FAILED_LOGIN", "Failed Login"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTIONS)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"
