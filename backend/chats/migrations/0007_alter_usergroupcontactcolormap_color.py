# Generated by Django 5.1.4 on 2025-01-15 09:26

from django.db import migrations, models

import chats.models


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0006_alter_usergroupcontactcolormap_color"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usergroupcontactcolormap",
            name="color",
            field=models.CharField(default=chats.models.get_random_color, max_length=8),
        ),
    ]
