# Generated by Django 4.2.1 on 2024-06-06 11:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User_app', '0005_alter_employee_details_department_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='street',
        ),
    ]
