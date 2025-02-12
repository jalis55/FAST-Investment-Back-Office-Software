from rest_framework import serializers
from .models import Project, Investment, FinancialAdvisor, Trade, Instrument,AccountReceivable  
from accounting.models import Account,Transaction
from django.contrib.auth import get_user_model
from django.db import transaction
from decimal import Decimal
from django.db.models import Sum

User = get_user_model()

class FinancialAdvisorSerializer(serializers.ModelSerializer):
    advisor_name = serializers.CharField(source='advisor.name', read_only=True)
    advisor_email = serializers.CharField(source='advisor.email', read_only=True)

    class Meta:
        model = FinancialAdvisor
        fields = ['advisor', 'com_percentage', 'advisor_name', 'advisor_email']



class InvestmentSerailizer(serializers.ModelField):
    class Meta:
        model=Investment
        fields=['project','investor','amount','authorized_by']

        

class InvestmentDetailsSerializer(serializers.ModelSerializer):
    investor_name = serializers.CharField(source='investor.name', read_only=True)
    investor_email = serializers.CharField(source='investor.email', read_only=True)

    class Meta:
        model = Investment
        fields = ['investor', 'amount', 'investor_name', 'investor_email']

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ['project', 'investor', 'amount', 'authorized_by']
        read_only_fields = ['authorized_by']

    def validate_amount(self, value):
        """Ensure the amount is a positive value."""
        if value <= 0:
            raise serializers.ValidationError("Amount must be a positive value.")
        return value

    def create(self, validated_data):
        investor = validated_data['investor']
        amount = Decimal(validated_data['amount'])
        project = validated_data['project']

        # Access request.user from serializer context
        authorized_by = self.context['request'].user

        # Use atomic transaction to ensure all operations succeed or rollback
        with transaction.atomic():
            # Check if the investor has an account; create one if not
            account, created = Account.objects.get_or_create(user=investor)

            # Update the account balance
            account.update_balance(amount, transaction_type='payment')

            # Create a transaction record
            transaction_record = Transaction.objects.create(
                user=investor,
                amount=amount,
                transaction_type='payment',
                narration=f'Payment for project: {project.project_id}',
                issued_by=authorized_by,
                status='completed'
            )

            # Remove authorized_by from validated_data to avoid duplication
            validated_data.pop('authorized_by', None)

            # Create the investment record
            investment = Investment.objects.create(
                **validated_data, 
                authorized_by=authorized_by  # Set the authorized_by field to request.user
            )

        return investment

class InvestmentContributionSerializer(serializers.ModelSerializer):
    contribution_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Investment
        fields = ['investor','amount', 'contribution_percentage']

    def get_contribution_percentage(self, obj):
        # Get the total investment for the project
        total_investment = Investment.objects.filter(project=obj.project).aggregate(total_amount=Sum('amount'))['total_amount'] or 1

        # Get the total investment by this investor in the project
        investor_investment = Investment.objects.filter(project=obj.project, investor=obj.investor).aggregate(investor_total=Sum('amount'))['investor_total'] or 0

        # Calculate the contribution percentage
        return round((investor_investment / total_investment) * 100, 2)


class TradeDetailsSerializer(serializers.ModelSerializer):
    instrument_id = serializers.IntegerField(source='instrument.id', read_only=True) 
    instrument_name = serializers.CharField(source='instrument.name', read_only=True)

    class Meta:
        model = Trade
        fields = ['id', 'instrument_id','instrument_name', 'qty', 'unit_price', 'trns_type', 'total_commission','actual_unit_price']

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ['id','project', 'instrument', 'qty', 'unit_price', 'trns_type', 'total_commission']




# Add the InstrumentSerializer
class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ['id', 'name'] 

class BuyableInstrumentSerializer(serializers.Serializer):
    instrument_id = serializers.IntegerField()
    name = serializers.CharField()
    available_quantity = serializers.IntegerField()
    average_buy_unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class AccountReceivableSerializer(serializers.ModelSerializer):
    class Meta:
        model=AccountReceivable
        fields=['project','investor','trade','contribute_amount','percentage','gain_lose','is_advisor']