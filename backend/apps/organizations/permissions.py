from rest_framework.permissions import BasePermission
from apps.organizations.models import OrganizationMember



class IsOrganizationMember(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.memberships.exists()

    def has_object_permission(self, request, view, obj):
        return obj.organization in [
            m.organization for m in request.user.memberships.all()
        ]



class IsOrganizationOwner(BasePermission):
    def has_permission(self, request, view):
        membership = getattr(request, "membership", None)
        if not membership:
            return False
        return membership.role == "OWNER"


