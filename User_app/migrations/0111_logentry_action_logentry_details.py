# Generated by Django 5.0.9 on 2025-04-01 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0110_rename_employer_id_employer_profile_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='logentry',
            name='action',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='logentry',
            name='details',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
