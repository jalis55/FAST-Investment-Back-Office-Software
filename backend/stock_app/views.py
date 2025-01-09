from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Project
from .projectserializers import ProjectSerializer
from .projectDetailsSerializers import ProjectDetailsSerializer
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can create projects

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create the project and related objects through the serializer
        project = serializer.save()

        # Return the full project data including related advisors and investments
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related('financial_advisors', 'investments', 'trades')
    serializer_class = ProjectDetailsSerializer
    permission_classes=[AllowAny]