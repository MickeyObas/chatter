from rest_framework import serializers

from accounts.serializers import UserSerializer, UserSummarySerializer

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    contact_user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Contact
        fields = [
            "id",
            "contact_user",
            "status",
            "is_favorite",
            "created_at",
            "updated_at",
        ]
