from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'user',
            'contact_user',
            'status',
            'created_at',
            'updated_at'
        ]       