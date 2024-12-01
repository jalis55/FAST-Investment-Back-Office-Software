from django.urls import path
from .views import ProjectListCreateView,ProjectRetrieveView

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='create-project'),
    path('projects/<int:pk>/', ProjectRetrieveView.as_view(), name='project-detail'),
]