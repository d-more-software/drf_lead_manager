from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Lead
from .serializers import LeadSerializer
from apps.organizations.permissions import IsOrganizationMember, IsOrganizationOwner


class LeadViewSet(ModelViewSet):
    serializer_class = LeadSerializer

    def get_permissions(self):
        if self.action == "destroy":
            return [IsAuthenticated(), IsOrganizationOwner()]
        return [IsAuthenticated(), IsOrganizationMember()]

    # 🔐 Organisation active du user
    def get_organization(self):
        org_slug = self.kwargs["org_slug"]

        membership = self.request.user.memberships.filter(
        organization__slug=org_slug
    ).first()

        if not membership:
            raise PermissionDenied("Not a member of this organization")

        self.request.organization = membership.organization
        self.request.membership = membership
        return membership.organization


    def get_queryset(self):
        return Lead.objects.filter(
            organization=self.get_organization()
        )

    def get_object(self):
        obj = super().get_object()
        if obj.organization != self.get_organization():
            raise PermissionDenied("Access denied.")
        return obj

    def perform_create(self, serializer):
        serializer.save(
            organization=self.get_organization(),
            created_by=self.request.user
        )
