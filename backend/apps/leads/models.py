from django.db import models
from apps.organizations.models import Organization
from apps.users.models import User


class Lead(models.Model):
    STATUS_CHOICES =(
        ("new","New"),
        ("contacted","Contacted"),
        ("qualified","Qualified"),
        ("lost","Lost"),
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="leads"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_leads"
    )

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30,blank=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="new")
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"