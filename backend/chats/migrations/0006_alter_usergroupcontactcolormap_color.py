# Generated by Django 5.1.4 on 2025-01-15 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0005_usergroupcontactcolormap"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usergroupcontactcolormap",
            name="color",
            field=models.CharField(default="#191970", max_length=8),
        ),
    ]
