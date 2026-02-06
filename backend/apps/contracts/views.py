from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Contract
from .serializers import ContractSerializer
from rest_framework.filters import SearchFilter



class ContractViewSet(ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [SearchFilter]
    search_fields = [
        "name",                             
        "company__name",                 
    ]
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(agency=user.agency)
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admin can create contracts.")
        serializer.save(agency=user.agency)


