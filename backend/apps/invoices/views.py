from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone

from apps.invoices.models import Invoice
from apps.invoices.serializers import InvoiceSerializer


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

        serializer.save(
            agency=user.agency,
            created_by=user,
            issue_date=timezone.now().date()
        )

    def perform_update(self, serializer):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can update invoices."
            )

        serializer.save()

    def perform_destroy(self, instance):
    
        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can delete invoices."
            )

        instance.delete()
