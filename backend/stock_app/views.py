from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Project, Instrument,Trade,Investment
from accounting.models import Account,Transaction
from .projectserializers import ProjectSerializer,ProjectBalanceSerializer
from .projectDetailsSerializers import ProjectDetailsSerializer
from .serializers import InstrumentSerializer,TradeSerializer,BuyableInstrumentSerializer,InvestmentSerializer
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F,Case, When, IntegerField

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

class ProjectBalanceView(generics.RetrieveAPIView):
    serializer_class = ProjectBalanceSerializer
    permission_classes = [AllowAny]


    def get_object(self):
        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, project_id=project_id)

        # Fetch total investment
        total_investment = Investment.objects.filter(project=project).aggregate(
                total=Sum('amount')
            )['total'] or 0  # Default to 0 if no investment

        # Calculate total buy
        total_buy = Trade.objects.filter(project=project, trns_type=Trade.BUY).aggregate(
            total=Sum(F('qty') * F('actual_unit_price'))
        )['total'] or Decimal('0.00')

        # Calculate total sell
        total_sell = Trade.objects.filter(project=project, trns_type=Trade.SELL).aggregate(
            total=Sum(F('qty') * F('actual_unit_price'))
        )['total'] or Decimal('0.00')

        # Compute available balance
        available_balance = total_investment + total_sell - total_buy

        return {
            "project_id": project.project_id,
            "available_balance": available_balance
        }

class InstrumentListView(generics.ListAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer
    permission_classes = [AllowAny]  # Allow any user to view instruments

class BuyableInstrumentView(generics.GenericAPIView):
    serializer_class = BuyableInstrumentSerializer
    permission_classes=[AllowAny]

    def get(self, request, project_id):
        """Returns available instrument quantity after buy/sell for a project."""
        try:
            # Ensure the project exists
            project = Project.objects.get(pk=project_id)

            # Aggregate total buy and sell quantities per instrument
            trades = Trade.objects.filter(project=project).values('instrument_id').annotate(
                total_buy=Sum(Case(When(trns_type='buy', then='qty'), default=0, output_field=IntegerField())),
                total_sell=Sum(Case(When(trns_type='sell', then='qty'), default=0, output_field=IntegerField()))
            )

            # Construct response data
            results = [
                {
                    'instrument_id': trade['instrument_id'],
                    'name': Instrument.objects.get(id=trade['instrument_id']).name,
                    'available_quantity': trade['total_buy'] - trade['total_sell']
                }
                for trade in trades if trade['total_buy'] - trade['total_sell'] > 0
            ]

            return Response(results, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)


class TradeCreateView(generics.CreateAPIView):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(authorized_by=self.request.user)



class InvestmentCreateAPIView(generics.CreateAPIView):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(authorized_by=self.request.user)

    