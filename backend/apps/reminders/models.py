from django.db import models
from django.utils import timezone


class Reminder(models.Model):

    class Type(models.TextChoices):
        EMAIL = "email", "Email"
        SMS = "sms", "SMS"
        CALL = "call", "Call"
        MANUAL = "manual", "Manual"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    invoice = models.ForeignKey(
        "invoices.Invoice",
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    agency = models.ForeignKey(
        "agencies.Agency",
        on_delete=models.CASCADE
    )

    type = models.CharField(max_length=20, choices=Type.choices)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    message = models.TextField(blank=True)

    scheduled_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    # ========================
    # helpers métier clean
    # ========================

    def mark_sent(self):
        self.status = self.Status.SENT
        self.sent_at = timezone.now()
        self.save(update_fields=["status", "sent_at"])

    def mark_failed(self):
        self.status = self.Status.FAILED
        self.save(update_fields=["status"])

    def cancel(self):
        self.status = self.Status.CANCELLED
        self.save(update_fields=["status"])

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.type}"
