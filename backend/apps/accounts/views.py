from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })




from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(ModelViewSet):
    """
    Gestion des utilisateurs d'une agence.
    - Un admin d’agence peut gérer tous les users de son agence
    - Un membre ne peut voir que son propre compte
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 🔐 Un user normal ne voit que lui-même
        if not user.is_agency_admin:
            return User.objects.filter(id=user.id)

        # 🔐 Un admin voit tous les users de SON agence
        return User.objects.filter(agency=user.agency)

    def perform_create(self, serializer):
        """
        Création d’un user dans l’agence de l’admin connecté
        """
        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admin can create users.")

        serializer.save(agency=user.agency)

    def perform_update(self, serializer):
        """
        Empêcher qu’un user quitte son agence ou devienne admin arbitrairement
        """
        user = self.request.user
        instance = self.get_object()

        if not user.is_agency_admin and instance != user:
            raise PermissionDenied("You cannot edit other users.")

        serializer.save()

    def perform_destroy(self, instance):
        """
        Empêcher la suppression du dernier admin
        """
        user = self.request.user

        if not user.is_agency_admin:
            raise PermissionDenied("Only agency admin can delete users.")

        if instance.is_agency_admin:
            admins = User.objects.filter(
                agency=user.agency,
                is_agency_admin=True
            ).count()

            if admins <= 1:
                raise PermissionDenied("Cannot delete the last agency admin.")

        instance.delete()

    # ======================================================
    # 🔑 ACTION MÉTIER : promouvoir / rétrograder un admin
    # ======================================================
    @action(detail=True, methods=["post"], url_path="set-admin")
    def set_admin(self, request, pk=None):
        """
        Permet à un admin d’agence de promouvoir ou rétrograder
        un user de la même agence.
        """

        requester = request.user
        target_user = self.get_object()

        # 🔐 Seul un admin peut agir
        if not requester.is_agency_admin:
            raise PermissionDenied("Only agency admins can manage roles.")

        # 🔐 Même agence obligatoire (sécurité multi-tenant)
        if target_user.agency != requester.agency:
            raise PermissionDenied("Cross-agency access forbidden.")

        is_admin = request.data.get("is_admin")

        if is_admin is None:
            return Response(
                {"detail": "`is_admin` field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔐 Empêcher la suppression du dernier admin
        if not is_admin and target_user.is_agency_admin:
            admins_count = User.objects.filter(
                agency=requester.agency,
                is_agency_admin=True
            ).count()

            if admins_count <= 1:
                raise PermissionDenied(
                    "Cannot remove the last agency admin."
                )

        target_user.is_agency_admin = bool(is_admin)
        target_user.save()

        return Response(
            {
                "user_id": target_user.id,
                "is_agency_admin": target_user.is_agency_admin
            },
            status=status.HTTP_200_OK
        )

