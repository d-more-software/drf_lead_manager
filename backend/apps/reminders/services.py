from datetime import timedelta
from django.utils import timezone
from .models import Reminder


def schedule_invoice_reminders(invoice):

    due_date = invoice.due_date

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="email",
        message="First reminder",
        scheduled_at=due_date + timedelta(days=7),
    )

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="email",
        message="Second reminder",
        scheduled_at=due_date + timedelta(days=15),
    )

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="call",
        message="Final reminder before legal action",
        scheduled_at=due_date + timedelta(days=30),
    )
