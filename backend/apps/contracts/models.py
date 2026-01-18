from django.db import models
from apps.companies.models import Company


class Contract(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="contracts")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    billing_periodicity = models.CharField(max_length=50)  
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.company.name} - {self.start_date}"
