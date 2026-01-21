from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer


class PaymentViewSet(ModelViewSet):
    """
    Gestion des paiements liés aux factures.
    """

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(
            invoice__agency=user.agency
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can register payments."
            )

        invoice = serializer.validated_data["invoice"]

        if invoice.agency != user.agency:
            raise PermissionDenied(
                "Invoice does not belong to your agency."
            )

        
        serializer.save()
