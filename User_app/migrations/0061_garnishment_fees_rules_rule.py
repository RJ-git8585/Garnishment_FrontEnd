# Generated by Django 5.0.9 on 2025-02-04 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0060_garnishment_fees_rules_garnishment_fees_states_rule'),
    ]

    operations = [
        migrations.AddField(
            model_name='garnishment_fees_rules',
            name='rule',
            field=models.CharField(default='Rule', max_length=255),
            preserve_default=False,
        ),
    ]
