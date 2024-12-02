from rest_framework import serializers
from .models import Project, Investment, FinancialAdvisor,Trade
from django.contrib.auth import get_user_model

User = get_user_model()


class FinancialAdvisorSerializer(serializers.ModelSerializer):
    advisor_name = serializers.CharField(source='advisor.name', read_only=True)
    advisor_email = serializers.CharField(source='advisor.email', read_only=True)
    class Meta:
        model = FinancialAdvisor
        fields = ['advisor', 'com_percentage','advisor_name', 'advisor_email']

class InvestmentSerializer(serializers.ModelSerializer):
    investor_name = serializers.CharField(source='investor.name', read_only=True)
    investor_email = serializers.CharField(source='investor.email', read_only=True)

    class Meta:
        model = Investment
        fields = ['investor', 'amount', 'investor_name', 'investor_email']


class TradeSerializer(serializers.ModelSerializer):
    instrument_name = serializers.CharField(source='instrument.name', read_only=True)
    class Meta:
        model = Trade
        fields = ['id','instrument_name', 'qty', 'unit_price', 'trns_type']  
