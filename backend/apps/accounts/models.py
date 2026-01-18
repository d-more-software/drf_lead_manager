from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.agencies.models import Agency


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_agency_admin = models.BooleanField(default=False)
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
