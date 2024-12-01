from rest_framework import serializers
from django.db import transaction
from .models import Project, Investment, FinancialAdvisor
from accounting.models import Transaction
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

class FinancialAdvisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialAdvisor
        fields = ['advisor', 'com_percentage']

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ['investor', 'amount']



class ProjectSerializer(serializers.ModelSerializer):
    financial_advisors = FinancialAdvisorSerializer(many=True, required=False)
    investments = InvestmentSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'project_description', 
            'total_investment', 'total_collection', 'gain_or_lose',
            'created_by', 'created_at', 'updated_at', 'financial_advisors', 'investments'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        financial_advisors_data = validated_data.pop('financial_advisors', [])
        investments_data = validated_data.pop('investments', [])

        with transaction.atomic():  # Ensure atomicity
            # Create the project with null values for investment and collection
            project = Project.objects.create(
                **validated_data,
                created_by=self.context['request'].user,
                total_investment=None,  # Set initial value as null
                total_collection=None,  # Set initial value as null
                gain_or_lose=None        # Set initial value as null
            )

            # Create and associate financial advisors
            for advisor_data in financial_advisors_data:
                FinancialAdvisor.objects.create(project=project, **advisor_data)

            # Create and associate investments with transactions
            for investment_data in investments_data:
                investor = investment_data['investor']
                investment_amount = investment_data['amount']

                # Retrieve investor's account
                investor_account = investor.account

                # Check if the investor has sufficient balance
                if investor_account.balance < investment_amount:
                    raise ValidationError({"detail": f"Insufficient balance for investor {investor}."})

                # Deduct the investment amount and update balance
                investor_account.update_balance(investment_amount, 'payment')

                # Create the investment record
                investment = Investment.objects.create(
                    project=project,
                    authorized_by=self.context['request'].user,
                    **investment_data
                )

                # Create a corresponding transaction
                Transaction.objects.create(
                    user=investor,
                    amount=investment_amount,
                    transaction_type='payment',  # Set transaction type as 'payment'
                    narration=f'Payment for project: {project.project_id}',
                    issued_by=self.context['request'].user,
                    status='completed'
                )

            return project
