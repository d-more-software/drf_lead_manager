from django.db import models
from apps.agencies.models import Agency


class Company(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name="companies")
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(
    max_length=20,
    blank=True,
    null=True,
)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.TextField(blank=True)

    responsible_name = models.CharField(max_length=255, blank=True)
    responsible_function = models.CharField(max_length=255, blank=True)

    accountant_name = models.CharField(max_length=255, blank=True)
    accountant_contact = models.CharField(max_length=255, blank=True)



    observation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return self.name
