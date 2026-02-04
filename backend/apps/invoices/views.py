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
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter




class InvoiceViewSet(ModelViewSet):

    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]


    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    # 🔵 filtres exacts
    filterset_fields = [
        "status",
        "company",
        "issue_date",
        "due_date",
    ]

    # 🔵 recherche texte
    search_fields = [
        "invoice_number",
        "company__name",
        "notes",
    ]

    ordering_fields = [
        "issue_date",
        "due_date",
        "amount_total",
        "created_at",
    ]

    def get_queryset(self):
        user = self.request.user

        return Invoice.objects.filter(
            agency=user.agency
        )


    def perform_create(self, serializer):
            user = self.request.user

            if not user.is_agency_admin:
                raise PermissionDenied("Only agency admins can create invoices.")

            invoice = serializer.save(
        agency=user.agency,
        created_by=user,
        issue_date=timezone.now().date()
    )

            try:
                schedule_invoice_reminders(invoice)
            except Exception:
                pass

            try:
                send_invoice_email(invoice)
            except Exception:
                pass

            invoice.company.refresh_status()


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


        invoice = self.get_object()

        buffer = generate_invoice_pdf(invoice)

        filename = f"invoice_{invoice.invoice_number}.pdf"

        return FileResponse(
        buffer,
        as_attachment=True,
        filename=filename,
        content_type="application/pdf"
    )

