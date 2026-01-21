from django.db import models
from django.conf import settings
from apps.invoices.models import Invoice


class Payment(models.Model):

    PAYMENT_METHODS = (
        ("cash", "Cash"),
        ("bank", "Bank Transfer"),
        ("mobile", "Mobile Money"),
        ("crypto", "Crypto"),
    )

    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    agency = models.ForeignKey(
        "agencies.Agency",
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_date = models.DateField()

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS
    )

    reference = models.CharField(
        max_length=255,
        blank=True
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self):
        return f"Payment {self.amount} for {self.invoice}"
