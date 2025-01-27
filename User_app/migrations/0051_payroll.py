# Generated by Django 5.0.9 on 2025-01-27 06:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0050_rename_blind_employee_detail_is_blind'),
    ]

    operations = [
        migrations.CreateModel(
            name='payroll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cid', models.CharField(max_length=255)),
                ('eeid', models.CharField(max_length=255)),
                ('payroll_date', models.DateField()),
                ('pay_date', models.DateField()),
                ('gross_pay', models.DecimalField(decimal_places=2, max_digits=250)),
                ('net_pay', models.DecimalField(decimal_places=2, max_digits=250)),
                ('taxes_federal_income_tax', models.DecimalField(decimal_places=2, max_digits=250)),
                ('taxes_state_tax', models.DecimalField(decimal_places=2, max_digits=250)),
                ('taxes_local_tax', models.DecimalField(decimal_places=2, max_digits=250)),
                ('taxes_medicare_tax', models.DecimalField(decimal_places=2, max_digits=250)),
                ('taxes_sdi', models.DecimalField(decimal_places=2, max_digits=250)),
                ('deductions', models.DecimalField(decimal_places=2, max_digits=250)),
                ('type', models.CharField(max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=250)),
            ],
        ),
    ]
