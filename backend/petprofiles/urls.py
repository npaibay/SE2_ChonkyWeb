from rest_framework.routers import DefaultRouter
from .views import PetProfileViewSet

router = DefaultRouter()
router.register(r'', PetProfileViewSet, basename='petprofile')

urlpatterns = router.urls