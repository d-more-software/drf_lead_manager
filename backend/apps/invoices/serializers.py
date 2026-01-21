from rest_framework import serializers
from apps.invoices.models import Invoice


class InvoiceSerializer(serializers.ModelSerializer):
    amount_due = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = (
            "id",
            "invoice_number",
            "issue_date",
            "due_date",
            "company",
            "contract",
            "amount_total",
            "amount_paid",
            "amount_due",
            "status",
            "notes",
            "created_at",
        )
        read_only_fields = (
            "invoice_number",
            "issue_date",
            "amount_paid",
            "amount_due",
            "created_at",
            "status",
        )

    def get_amount_due(self, obj):

        return max(obj.amount_total - obj.amount_paid, 0)

    def validate(self, data):

        amount_total = data.get("amount_total")

        if amount_total is not None and amount_total <= 0:
            raise serializers.ValidationError(
                "Invoice total amount must be greater than zero."
            )

        return data
