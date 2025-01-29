from django.urls import path
from .views import ProjectListCreateView,ProjectDetailView,InstrumentListView,TradeCreateView

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='create-project'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('instruments/', InstrumentListView.as_view(), name='instrument-list'),
    path('create-trade/', TradeCreateView.as_view(), name='create-trade'),
]