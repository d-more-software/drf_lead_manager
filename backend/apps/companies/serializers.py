from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):

    total_due = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = (
            "id",
            "name",
            "sector",
            "email",
            "phone",
            "responsible_name",
            "responsible_function",
            "accountant_name",
            "accountant_contact",
            "province",
            "city",
            "address",
            "observation",

            # 🔴 nouveaux
            "credit_limit",
            "status",
            "total_due",

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "status",
            "total_due",
            "created_at",
            "updated_at",
        )

    def get_total_due(self, obj):
        return obj.total_due
