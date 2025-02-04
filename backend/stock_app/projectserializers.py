from rest_framework import serializers
from django.db import transaction
from rest_framework.exceptions import ValidationError
from accounting.models import Account,Transaction
from .serializers import FinancialAdvisorSerializer,InvestmentDetailsSerializer
from .models import Project,FinancialAdvisor,Investment




class ProjectSerializer(serializers.ModelSerializer):
    financial_advisors = FinancialAdvisorSerializer(many=True, required=False)
    investments = InvestmentDetailsSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'project_description',
            'total_investment', 'total_collection', 'gain_or_lose',
            'created_by', 'created_at', 'updated_at', 'financial_advisors', 'investments'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        advisor_data = validated_data.pop('financial_advisors', [])
        investor_data = validated_data.pop('investments', [])

        # Set the created_by field to the current user
        request_user = self.context['request'].user
        project = Project.objects.create(created_by=request_user, **validated_data)

        # Process financial advisors
        for advisor in advisor_data:
            FinancialAdvisor.objects.create(project=project, **advisor)

        # Process investments and deduct from account
        for investor in investor_data:
            inv_user = investor.get('investor')
            amount = investor.get('amount')

            # Retrieve the user's account
            try:
                account = Account.objects.get(user_id=inv_user)
            except Account.DoesNotExist:
                raise ValidationError(f"No account found for user ID {inv_user}.")

            # Deduct the amount from the account
            account.update_balance(amount, 'payment')

            # Create the investment record with the project reference
            Investment.objects.create(
            project=project,
            investor=inv_user,
            amount=amount,
            authorized_by=request_user  # Set the authorized_by field
            )

                            # Create a corresponding transaction
            Transaction.objects.create(
                    user=inv_user,
                    amount=amount,
                    transaction_type='payment',  # Set transaction type as 'payment'
                    narration=f'Payment for project: {project.project_id}',
                    issued_by=self.context['request'].user,
                    status='completed'
                )

        return project
    
class ProjectBalanceSerializer(serializers.Serializer):
    project_id = serializers.CharField()
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2)