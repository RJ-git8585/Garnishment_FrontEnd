# Generated by Django 5.0.9 on 2025-03-31 13:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0099_rename_level_logdata_status_logdata_api_name_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employer_profile',
            old_name='employer_id',
            new_name='employers_id',
        ),
    ]
