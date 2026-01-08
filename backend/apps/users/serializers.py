from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = ("id", "email", "username", "organization")


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

        user = User.objects.create_user(**validated_data)

        organization = Organization.objects.create(
            name=organization_name,
            owner=user
        )

        user.organization = organization
        user.save()

        return user
