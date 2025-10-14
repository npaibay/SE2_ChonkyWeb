"""
URL configuration for se2_chonkyweb project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
# se2_chonkyweb/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # App namespaces (explicit, no overlapping "api/" includes)
    path("api/users/", include("users.urls")),              # /api/users/...
    path("api/products/", include("products.urls")),        # /api/products/...
    path("api/pet-profiles/", include("petprofiles.urls")), # /api/pet-profiles/...
    path("api/services/", include("services.urls")),        # /api/services/...
]
