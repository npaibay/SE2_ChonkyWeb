from django.shortcuts import render
from rest_framework import viewsets
from .models import PetProfile
from .serializers import PetProfileSerializer

# Create your views here.

class PetProfileViewSet(viewsets.ModelViewSet):
    queryset = PetProfile.objects.all()
    serializer_class = PetProfileSerializer
