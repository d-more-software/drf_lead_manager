from rest_framework import serializers
from apps.agencies.models import Agency 


class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = "__all__"
