# Generated by Django 5.0.9 on 2025-02-14 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0078_alter_garnishment_fees_payable_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee_detail',
            name='case_id',
            field=models.CharField(default='C0014', max_length=255),
            preserve_default=False,
        ),
    ]
