from rest_framework import serializers
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reminder
        fields = (
            "id",
            "invoice",
            "type",
            "status",
            "message",
            "scheduled_at",
            "sent_at",
            "created_at",
        )
        read_only_fields = (
            "status",
            "sent_at",
            "created_at",
        )
