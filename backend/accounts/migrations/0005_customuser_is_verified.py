# Generated by Django 5.1.4 on 2024-12-21 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_alter_customuser_options"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
    ]
