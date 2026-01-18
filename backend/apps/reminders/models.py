from django.db import models
from apps.invoices.models import Invoice


class Reminder(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="reminders")
    sent_at = models.DateTimeField(null=True, blank=True)
    level = models.PositiveIntegerField()  # 1 = 30j, 2 = 60j...

    def __str__(self):
        return f"Reminder {self.level} - {self.invoice.number}"
