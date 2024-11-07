# Generated by Django 5.1.2 on 2024-11-06 10:21

import django.db.models.deletion
import stock_app.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('project_id', models.CharField(default=stock_app.models.generate_unique_id, max_length=8, primary_key=True, serialize=False, unique=True)),
                ('project_title', models.CharField(max_length=255)),
                ('project_description', models.TextField()),
                ('total_investment', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_collection', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('gain_or_lose', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
