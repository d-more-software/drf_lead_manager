from django.db import models
from django.utils import timezone


class Reminder(models.Model):

    TYPE_CHOICES = (
        ("email", "Email"),
        ("sms", "SMS"),
        ("call", "Call"),
        ("manual", "Manual"),
    )

    STATUS_CHOICES = (
        ("scheduled", "Scheduled"),
        ("sent", "Sent"),
        ("failed", "Failed"),
    )

    invoice = models.ForeignKey(
        "invoices.Invoice",
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    agency = models.ForeignKey(
        "agencies.Agency",
        on_delete=models.CASCADE
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")

    message = models.TextField(blank=True)

    scheduled_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def mark_sent(self):
        self.status = "sent"
        self.sent_at = timezone.now()
        self.save(update_fields=["status", "sent_at"])

    def mark_failed(self):
        self.status = "failed"
        self.save(update_fields=["status"])

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.type}"
