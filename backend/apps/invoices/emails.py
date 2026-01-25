from django.core.mail import EmailMessage
from django.conf import settings

from apps.invoices.service.pdf_service import generate_invoice_pdf


def send_invoice_email(invoice):
    """
    Envoie la facture PDF par email à la company.
    Logique métier pure (aucun HTTP).
    """

    company = invoice.company
    agency = invoice.agency

    if not company.email:
        return  # pas d'email → on skip proprement

    # =========================
    # LANGUE
    # =========================

    if agency.language == "FR":
        subject = f"Facture {invoice.invoice_number}"
        body = (
            f"Bonjour {company.name},\n\n"
            f"Veuillez trouver ci-joint votre facture.\n\n"
            f"Date d'échéance : {invoice.due_date}\n\n"
            f"Cordialement,\n{agency.name}"
        )
    else:
        subject = f"Invoice {invoice.invoice_number}"
        body = (
            f"Hello {company.name},\n\n"
            f"Please find your invoice attached.\n\n"
            f"Due date: {invoice.due_date}\n\n"
            f"Best regards,\n{agency.name}"
        )

    # =========================
    # PDF
    # =========================

    pdf_buffer = generate_invoice_pdf(invoice)

    filename = f"{invoice.invoice_number}.pdf"

    # =========================
    # EMAIL
    # =========================

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[company.email],
    )

    email.attach(
        filename,
        pdf_buffer.read(),
        "application/pdf"
    )

    email.send()
