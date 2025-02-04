from django.urls import path
from .views import (ProjectListCreateView,ProjectDetailView
                    ,InstrumentListView,TradeCreateView,ProjectBalanceView
                    ,BuyableInstrumentView,InvestmentCreateAPIView)

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='create-project'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('instruments/', InstrumentListView.as_view(), name='instrument-list'),
    path('create-trade/', TradeCreateView.as_view(), name='create-trade'),
    path('project-balance/<str:project_id>/', ProjectBalanceView.as_view(), name='project-balance'),
    path('buyable-instruments/<str:project_id>/',BuyableInstrumentView.as_view(),name='buyable-instruments'),
    path('add-investment/',InvestmentCreateAPIView.as_view(),name='add-investment'),
    

]