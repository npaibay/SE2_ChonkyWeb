from django.db import models

class PetProfile(models.Model):
    name = models.CharField(max_length=100)
    owner = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)

    def __str__(self):
        return self.name
