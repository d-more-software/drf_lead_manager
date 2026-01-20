from django.db import models
from apps.agencies.models import Agency
from apps.companies.models import Company



class Contract(models.Model):

    BILLING_FREQUENCY_CHOICES = (
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
        ("YEARLY", "Yearly"),
    )

    
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="contracts"
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="contracts")
    name = models.CharField(max_length=255)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    billing_frequency = models.CharField(
        max_length=20,
        choices=BILLING_FREQUENCY_CHOICES
    )
    billing_day = models.PositiveSmallIntegerField(
        help_text="Day of month when invoice is generated"
    )

    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=100,
        blank=True
    )
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.company.name} - {self.name} - {self.start_date}"
