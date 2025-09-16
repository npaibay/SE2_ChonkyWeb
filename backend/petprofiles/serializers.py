from rest_framework import serializers
from .models import PetProfile

class PetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = ['id', 'name', 'owner', 'breed']