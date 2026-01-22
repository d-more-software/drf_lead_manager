from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderViewSet(ModelViewSet):

    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reminder.objects.filter(agency=user.agency)

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied(
                "Only agency admins can create reminders."
            )

        serializer.save(agency=user.agency)
