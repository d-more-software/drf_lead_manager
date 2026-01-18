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
