from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)

    # NEW FIELDS
    unit = models.CharField(max_length=50, blank=True, null=True)  # "pcs", "kg", "ml", etc
    price = models.DecimalField(max_digits=10, decimal_places=2)   # default unit price

    stock = models.IntegerField(default=0)
    restock_level = models.IntegerField(default=0)

    category = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
