from decimal import Decimal
from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.invoices.models import Invoice
from apps.payments.models import Payment


class BillingStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        agency = request.user.agency
        today = timezone.now().date()

        invoices = Invoice.objects.filter(agency=agency)

        # -------------------------
        # total unpaid
        # -------------------------
        unpaid = invoices.exclude(status="paid").aggregate(
            total=Sum("amount_total") - Sum("amount_paid")
        )["total"] or Decimal("0")

        # -------------------------
        # overdue
        # -------------------------
        overdue = invoices.filter(
            due_date__lt=today
        ).exclude(status="paid").aggregate(
            total=Sum("amount_total") - Sum("amount_paid")
        )["total"] or Decimal("0")

        # -------------------------
        # paid this month
        # -------------------------
        start_month = today.replace(day=1)

        paid_this_month = Payment.objects.filter(
            agency=agency,
            payment_date__gte=start_month
        ).aggregate(
            total=Sum("amount")
        )["total"] or Decimal("0")

        # -------------------------
        # invoices count
        # -------------------------
        count = invoices.count()

        return Response({
            "total_unpaid": unpaid,
            "overdue": overdue,
            "paid_this_month": paid_this_month,
            "invoices_count": count,
        })
