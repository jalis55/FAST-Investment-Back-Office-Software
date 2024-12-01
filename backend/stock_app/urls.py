from django.urls import path
from .views import ProjectCreateView,ProjectRetrieveView

urlpatterns = [
    path('projects/', ProjectCreateView.as_view(), name='create-project'),
    path('projects/<int:pk>/', ProjectRetrieveView.as_view(), name='project-detail'),
]