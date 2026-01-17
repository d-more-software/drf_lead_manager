from django.db import models
from django.contrib.auth.models import AbstractUser
from apps.organizations.models import Organization


class User(AbstractUser):
    email = models.EmailField(unique=True)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        related_name="users"
    )

    USERNAME_FIELD = "email"    
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
