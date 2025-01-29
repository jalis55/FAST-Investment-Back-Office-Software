from django.db import models
from django.conf import settings
import random
import uuid

# Create your models here.

def generate_unique_id():
    while True:
        project_id = str(random.randint(10000000, 99999999))  # Generate 8-digit ID
        if not Project.objects.filter(project_id=project_id).exists():
            return project_id
        
# def generate_unique_trade_id():
#     return uuid.uuid4().hex[:8].upper()

class Project(models.Model):
    project_id = models.CharField(max_length=8, primary_key=True, default=generate_unique_id, unique=True)
    project_title = models.CharField(max_length=255)
    project_description = models.TextField()
    total_investment = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_collection = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gain_or_lose = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_title} ({self.project_id})"
    

class Investment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE,related_name='investments')
    investor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='investor_name')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    authorized_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='authorized_trades')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.project.project_title
class FinancialAdvisor(models.Model):
    advisor=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='advisor')
    com_percentage=models.DecimalField(max_digits=10, decimal_places=2)
    project = models.ForeignKey(Project, on_delete=models.CASCADE,related_name="financial_advisors")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Instrument(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    face_value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return self.name

class Trade(models.Model):
    BUY = 'buy'
    SELL = 'sell'

    TRANSACTION_TYPES = [
        (BUY, 'Buy'),
        (SELL, 'Sell'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='trades')
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE)
    trns_type = models.CharField(max_length=6, choices=TRANSACTION_TYPES)
    qty = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    actual_unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    trade_date = models.DateField(auto_now_add=True)
    total_commission = models.DecimalField(max_digits=10, decimal_places=2)
    authorized_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investor')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_actual_unit_price(self):
        """Calculates and sets the actual unit price."""
        if self.qty == 0:
            return None  # Avoid division by zero

        if self.trns_type == self.BUY:
            price = ((self.qty * self.unit_price) + self.total_commission) / self.qty
        elif self.trns_type == self.SELL:
            price = ((self.qty * self.unit_price) - self.total_commission) / self.qty
        else:
            return None

        self.actual_unit_price = round(price, 2)
        return self.actual_unit_price  # Return for immediate use if needed

    def save(self, *args, **kwargs):
        """Override save() to automatically compute actual_unit_price before saving."""
        self.calculate_actual_unit_price()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.id)