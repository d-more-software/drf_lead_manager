from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(ModelViewSet):

    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

        # 🔽 AJOUT CRITIQUE
    filter_backends = [SearchFilter]
    search_fields = ["name", "email", "city", "sector"]

    def get_queryset(self):

        user = self.request.user

        if not user.agency:
            return Company.objects.none()

        return Company.objects.filter(agency=user.agency)

    def perform_create(self, serializer):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admins can create companies.")

        serializer.save(agency=user.agency)

    def perform_update(self, serializer):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admins can update companies.")

        serializer.save()

    def perform_destroy(self, instance):

        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admins can delete companies.")

        instance.delete()


