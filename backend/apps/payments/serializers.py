from rest_framework import serializers
from django.utils import timezone
from decimal import Decimal

from apps.payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = (
            "id",
            "invoice",
            "amount",
            "payment_date",
            "payment_method",
            "reference",
            "created_at",
        )
        read_only_fields = (
            "payment_date",
            "created_at",
        )

    def validate(self, data):
        invoice = data["invoice"]
        amount = data["amount"]

        if invoice.status == "paid":
            raise serializers.ValidationError(
                "This invoice is already fully paid."
            )

        if amount <= Decimal("0.00"):
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        remaining = invoice.amount_total - invoice.amount_paid

        if amount > remaining:
            raise serializers.ValidationError(
                "Payment amount cannot exceed remaining amount due."
            )

        return data

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None

        invoice = validated_data["invoice"]
        amount = validated_data["amount"]

        payment = Payment.objects.create(
            invoice=invoice,
            agency=user.agency,
            created_by=user,
            amount=amount,
            payment_method=validated_data.get("payment_method"),
            reference=validated_data.get("reference"),
            payment_date=timezone.now().date(),
        )

        # ✅ update invoice amounts
        invoice.amount_paid += amount

        if invoice.amount_paid >= invoice.amount_total:
            invoice.status = "paid"
        else:
            invoice.status = "partial"

        invoice.save()

        # ✅ refresh company status (CRUCIAL)
        invoice.company.refresh_status()

        return payment
