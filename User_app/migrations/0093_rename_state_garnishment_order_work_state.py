# Generated by Django 5.0.9 on 2025-03-17 07:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0092_remove_garnishment_order_record_import'),
    ]

    operations = [
        migrations.RenameField(
            model_name='garnishment_order',
            old_name='state',
            new_name='work_state',
        ),
    ]
