# Generated by Django 5.1.4 on 2025-01-08 16:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("contacts", "0003_remove_contact_status_text"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="contact",
            options={"ordering": ["contact_user__email"]},
        ),
    ]
