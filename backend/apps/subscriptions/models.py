from django.db import models
from apps.agencies.models import Agency


class Subscription(models.Model):
    agency = models.OneToOneField(Agency, on_delete=models.CASCADE)
    plan = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    started_at = models.DateField(auto_now_add=True)
