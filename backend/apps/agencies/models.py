from django.db import models


class Agency(models.Model):
    name = models.CharField(max_length=255, unique=True)
    sector = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
