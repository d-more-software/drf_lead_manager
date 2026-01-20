from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract

        fields = (
            "id",
            "agency",
            "company",
            "name",
            "start_date",
            "end_date",
            "billing_frequency",
            "billing_day",
            "amount_due",
            "payment_method",
            "notes",
        )
        read_only_fields = ("agency",)
