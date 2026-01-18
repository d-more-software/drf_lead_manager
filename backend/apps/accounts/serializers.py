from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.agencies.models import Agency

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "agency", "is_agency_admin")
        read_only_fields = ("agency", "is_agency_admin")

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)

        user.save()
        return user



class RegisterSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "agency_name")
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        agency_name = validated_data.pop("agency_name")

        # 1. Création de l’agence
        agency = Agency.objects.create(name=agency_name)

        # 2. Création de l’utilisateur admin
        user = User.objects.create_user(
            **validated_data,
            agency=agency,
            is_agency_admin=True
        )

        return user
