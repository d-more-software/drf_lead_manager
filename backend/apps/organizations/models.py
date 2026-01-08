from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Organization(models.Model):
    name = models.CharField(max_length=255,unique=True)
    slug = models.SlugField(max_length=255,unique=True,blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE,
                              related_name="owned_organizations")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args,**kwargs)

    def __str__(self):
        return self.name