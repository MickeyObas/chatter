# Generated by Django 5.1.4 on 2024-12-19 20:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_customuser_deleted_at"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="customuser",
            options={"verbose_name": "User", "verbose_name_plural": "Users"},
        ),
    ]
