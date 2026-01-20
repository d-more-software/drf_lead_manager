from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
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
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )
