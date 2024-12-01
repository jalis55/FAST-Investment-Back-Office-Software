from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import ProjectSerializer
from .models import Project

class ProjectCreateView(generics.CreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class ProjectRetrieveView(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related('financialadvisor_set', 'investment_set')  # Correct related names
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]