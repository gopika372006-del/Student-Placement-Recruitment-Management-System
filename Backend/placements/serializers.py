from rest_framework import serializers
from .models import Placement, Requirement, Interview


class PlacementSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    class Meta:
        model = Placement
        fields = "__all__"


class RequirementSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    class Meta:
        model = Requirement
        fields = "__all__"


class InterviewSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    class Meta:
        model = Interview
        fields = "__all__"