from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    # Define optional fields explicitly if needed
    total_investment = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    total_collection = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    gain_or_lose = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = Project
        fields = [
            'project_id', 
            'project_title', 
            'project_description', 
            'total_investment', 
            'total_collection', 
            'gain_or_lose', 
            'created_by', 
            'created_at', 
            'updated_at'
        ]
        # Set fields to read-only if they shouldn't be updated
        read_only_fields = ['created_by', 'created_at', 'updated_at']
