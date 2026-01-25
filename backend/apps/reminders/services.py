from django.utils import timezone
from django.core.mail import EmailMessage
from django.conf import settings

from .models import Reminder


# =========================================================
# Création reminders
# =========================================================

def schedule_invoice_reminders(invoice):
    from datetime import timedelta

    due_date = invoice.due_date

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="email",
        message="Premier rappel",
        scheduled_at=due_date + timedelta(days=7),
    )

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="email",
        message="Deuxième rappel",
        scheduled_at=due_date + timedelta(days=15),
    )

    Reminder.objects.create(
        invoice=invoice,
        agency=invoice.agency,
        type="call",
        message="Dernier rappel avant contentieux",
        scheduled_at=due_date + timedelta(days=30),
    )


# =========================================================
# Email builder
# =========================================================

def build_reminder_email(reminder):
    invoice = reminder.invoice
    company = invoice.company
    agency = reminder.agency

    remaining = invoice.amount_total - invoice.amount_paid
    currency = getattr(agency, "currency", "")

    if agency.language == "FR":
        subject = f"Rappel – Facture {invoice.invoice_number}"
        body = (
            f"Bonjour {company.name},\n\n"
            f"Ceci est un rappel pour la facture {invoice.invoice_number}.\n"
            f"Montant restant : {remaining} {currency}\n"
            f"Échéance : {invoice.due_date}\n\n"
            f"Cordialement,\n{agency.name}"
        )
    else:
        subject = f"Reminder – Invoice {invoice.invoice_number}"
        body = (
            f"Hello {company.name},\n\n"
            f"This is a reminder for invoice {invoice.invoice_number}.\n"
            f"Remaining amount: {remaining} {currency}\n"
            f"Due date: {invoice.due_date}\n\n"
            f"{agency.name}"
        )

    return subject, body


# =========================================================
# Envoi automatique
# =========================================================

def send_due_reminders():
    now = timezone.now()

    reminders = Reminder.objects.filter(
        scheduled_at__lte=now,
        status=Reminder.Status.PENDING,

    )

    for reminder in reminders:

        company = reminder.invoice.company

        if not company.email:
            reminder.status = "failed"
            reminder.save(update_fields=["status"])
            continue

        subject, body = build_reminder_email(reminder)

        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[company.email],
        )

        try:
            email.send()
            reminder.mark_sent()
        except Exception:
            reminder.mark_failed()


