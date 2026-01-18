from django.db import models
from apps.contracts.models import Contract


class Invoice(models.Model):
    STATUS_CHOICES = (
        ("DRAFT", "Brouillon"),
        ("SENT", "Envoyée"),
        ("PAID", "Payée"),
        ("OVERDUE", "Impayée"),
    )

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="invoices")
    number = models.CharField(max_length=50)
    issue_date = models.DateField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_ref = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="DRAFT")

    def __str__(self):
        return self.number
