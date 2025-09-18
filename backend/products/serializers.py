from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "unit",
            "price",
            "stock",
            "restock_level",
            "category",
            "expiry_date",
            "is_active",
        ]
