from django.db import models
from django.utils import timezone

from apps.agencies.models import Agency
from apps.accounts.models import User
from apps.companies.models import Company
from apps.contracts.models import Contract


class Invoice(models.Model):


    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("pending","Pending"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("cancelled", "Cancelled"),
    )


    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="invoices"
    )


    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="invoices"
    )

    contract = models.ForeignKey(
        Contract,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices"
    )


    invoice_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True
    )


    issue_date = models.DateField()
    due_date = models.DateField()


    amount_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amount_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )


    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )


    notes = models.TextField(
        blank=True
    )


    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_invoices"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-issue_date"]
        unique_together = ("agency", "invoice_number")



    @property
    def amount_due(self):

        return max(self.amount_total - self.amount_paid,0)

    def save(self, *args, **kwargs):

        if not self.invoice_number:
            year = timezone.now().year
            count = Invoice.objects.filter(
                agency=self.agency,
                invoice_number__startswith=f"INV-{year}"
            ).count() + 1

            self.invoice_number = f"INV-{year}-{count:05d}"


        if (
            self.status not in ["paid", "cancelled"]
            and self.due_date < timezone.now().date()
            and self.amount_due > 0
        ):
            self.status = "overdue"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.company.name}"
