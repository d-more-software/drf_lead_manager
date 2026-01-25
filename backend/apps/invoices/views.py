from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from apps.reminders.services import schedule_invoice_reminders

from apps.invoices.models import Invoice
from apps.invoices.serializers import InvoiceSerializer
from django.http import FileResponse
from rest_framework.decorators import action
from apps.invoices.service.pdf_service import generate_invoice_pdf
from apps.invoices.emails import send_invoice_email




class InvoiceViewSet(ModelViewSet):

    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Invoice.objects.filter(
            agency=user.agency
        )

    def perform_create(self, serializer):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can create invoices."
            )

        invoice = serializer.save(
        agency=user.agency,
        created_by=user,
        issue_date=timezone.now().date()
        )

        schedule_invoice_reminders(invoice)
        send_invoice_email(invoice)


            

        # ✅ refresh company status
        invoice.company.refresh_status()

    def perform_update(self, serializer):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can update invoices."
            )

        invoice = serializer.save()

        # ✅ refresh company status
        invoice.company.refresh_status()

    def perform_destroy(self, instance):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can delete invoices."
            )

        company = instance.company

        instance.delete()

        # ✅ refresh company status
        company.refresh_status()

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        """
    GET /api/invoices/{id}/pdf/
    Retourne le PDF de la facture.
    """

        invoice = self.get_object()

        buffer = generate_invoice_pdf(invoice)

        filename = f"invoice_{invoice.invoice_number}.pdf"

        return FileResponse(
        buffer,
        as_attachment=True,
        filename=filename,
        content_type="application/pdf"
    )

