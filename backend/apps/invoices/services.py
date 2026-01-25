from datetime import timedelta
from django.utils import timezone

from apps.contracts.models import Contract
from apps.invoices.models import Invoice
from apps.reminders.services import schedule_invoice_reminders
from apps.invoices.emails import send_invoice_email



def months_between(d1, d2):

    return (d1.year - d2.year) * 12 + (d1.month - d2.month)


def generate_invoices_for_today():


    today = timezone.now().date()

    contracts = Contract.objects.filter(start_date__lte=today)

    for contract in contracts:

        # -------------------------
        # 1. contrat expiré ?
        # -------------------------
        if contract.end_date and contract.end_date < today:
            continue

        # -------------------------
        # 2. bon jour du mois ?
        # -------------------------
        if contract.billing_day != today.day:
            continue

        # -------------------------
        # 3. fréquence respectée ?
        # -------------------------
        months_passed = months_between(today, contract.start_date)
        freq = contract.get_frequency_months()

        if months_passed % freq != 0:
            continue

        # -------------------------
        # 4. évite doublon
        # -------------------------
        already_exists = Invoice.objects.filter(
            contract=contract,
            issue_date=today
        ).exists()

        if already_exists:
            continue

        # -------------------------
        # 5. créer numéro facture
        # -------------------------
        count_today = Invoice.objects.filter(issue_date=today).count() + 1
        number = f"INV-{today.strftime('%Y%m%d')}-{count_today:04d}"

        # -------------------------
        # 6. créer facture
        # -------------------------
        invoice = Invoice.objects.create(
            agency=contract.agency,
            company=contract.company,
            contract=contract,
            invoice_number=number,
            issue_date=today,
            due_date=today + timedelta(days=30),
            amount_total=contract.amount_due,
            amount_paid=0,
            status="pending",
        )

        # -------------------------
        # 7. planifier reminders
        # -------------------------
        schedule_invoice_reminders(invoice)
        send_invoice_email(invoice)


