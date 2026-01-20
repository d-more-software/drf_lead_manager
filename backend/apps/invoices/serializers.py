from rest_framework import serializers
from apps.invoices.models import Invoice


class InvoiceSerializer(serializers.ModelSerializer):


    amount_due = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

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
        )

    def validate(self, data):

        amount_total = data.get("amount_total")
        amount_paid = data.get("amount_paid", 0)

        if amount_total is not None and amount_paid > amount_total:
            raise serializers.ValidationError(
                "Paid amount cannot exceed total invoice amount."
            )

        return data
