from io import BytesIO

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


CURRENCY_SYMBOLS = {
    "EUR": "€",
    "USD": "$",
    "GBP": "£",
    "TRY": "₺",

    # Afrique
    "XAF": "FCFA",
    "XOF": "FCFA",
    "MAD": "MAD",
    "DZD": "DZD",
    "TND": "TND",
}


def _texts(language, company_name):

    if language == "EN":
        return {
            "title": "INVOICE",
            "agency": "Agency",
            "bill_to": "Bill To",
            "number": "Invoice number",
            "issue": "Issue date",
            "due": "Due date",
            "total": "Total",
            "paid": "Paid",
            "remaining": "Remaining",
            "status": "Status",
            "message": (
                f"Dear {company_name},<br/><br/>"
                "Please complete the payment before the due date.<br/><br/>"
                "Thank you for your trust."
            ),
            "footer": "Payment instructions: bank transfer or agreed method."
        }

    # 🇫🇷 FULL FR
    return {
        "title": "FACTURE",
        "agency": "Agence",
        "bill_to": "Facturé à",
        "number": "Numéro de facture",
        "issue": "Date d’émission",
        "due": "Date d’échéance",
        "total": "Montant total",
        "paid": "Déjà payé",
        "remaining": "Reste à payer",
        "status": "Statut",
        "message": (
            f"Bonjour {company_name},<br/><br/>"
            "Merci d’effectuer votre règlement avant la date d’échéance.<br/><br/>"
            "Nous restons à votre disposition pour toute question."
        ),
        "footer": "Instructions de paiement : virement bancaire ou méthode convenue."
    }


def generate_invoice_pdf(invoice):

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()
    elements = []

    agency = invoice.agency
    company = invoice.company

    symbol = CURRENCY_SYMBOLS.get(agency.currency, "")
    t = _texts(agency.language, company.name)

    remaining = invoice.amount_total - invoice.amount_paid

    elements.append(Paragraph(t["title"], styles["Heading1"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph(f"<b>{t['agency']} :</b> {agency.name}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(f"<b>{t['bill_to']} :</b> {company.name}", styles["Normal"]))
    elements.append(Paragraph(company.email or "", styles["Normal"]))
    elements.append(Spacer(1, 20))

    data = [
        [t["number"], invoice.invoice_number],
        [t["issue"], str(invoice.issue_date)],
        [t["due"], str(invoice.due_date)],
        [t["total"], f"{invoice.amount_total} {symbol}"],
        [t["paid"], f"{invoice.amount_paid} {symbol}"],
        [t["remaining"], f"{remaining} {symbol}"],
        [t["status"], invoice.status.upper()],
    ]

    table = Table(data, hAlign="LEFT")

    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 30))

    elements.append(Paragraph(t["message"], styles["Normal"]))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph(t["footer"], styles["Italic"]))

    doc.build(elements)

    buffer.seek(0)

    return buffer
