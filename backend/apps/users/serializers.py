from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization, OrganizationMember

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "username", "organization")

    def get_organization(self, user):
        membership = user.memberships.first()
        if membership:
            return membership.organization.name
        return None



class RegisterSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "email",
            "username",
            "password",
            "organization_name",
        )
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        organization_name = validated_data.pop("organization_name")

    # 1. Créer l'utilisateur
        user = User.objects.create_user(**validated_data)

    # 2. Créer l'organisation
        organization = Organization.objects.create(
            name=organization_name,
            owner=user
            )

    # 3. Créer le lien avec rôle OWNER
        OrganizationMember.objects.create(
            user=user,
            organization=organization,
            role="OWNER"
    )

        return user
