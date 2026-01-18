from django.db import models
from apps.agencies.models import Agency


class Company(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name="companies")
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=255)
    email = models.EmailField()
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    contact_name = models.CharField(max_length=255)
    contact_role = models.CharField(max_length=255)
    contact_email = models.EmailField(blank=True, null=True)

    contact_phone = models.CharField(
    max_length=20,
    blank=True,
    null=True,
)


    def __str__(self):
        return self.name
