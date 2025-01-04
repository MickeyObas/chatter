from rest_framework import serializers

from .models import Chat
from accounts.serializers import UserSummarySerializer
from messaging.serializers import MessageSerializer


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    owner = UserSummarySerializer()
    user = UserSummarySerializer()
    has_unread_message = serializers.SerializerMethodField(read_only=True)
    
    def get_has_unread_message(self, obj):
        return obj.has_unread_message()

    class Meta: 
        model = Chat
        fields = [
            'id',
            'owner',
            'user',
            'messages',
            'created_at',
            'updated_at',
            'has_unread_message'
        ]


class ChatDisplaySerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    user = UserSummarySerializer()
    has_unread_message = serializers.SerializerMethodField(read_only=True)
    
    def get_has_unread_message(self, obj):
        return obj.has_unread_message()

    class Meta:
        model = Chat
        fields = [
            'id',
            'user',
            'latest_message',
            'created_at',
            'updated_at',
            'has_unread_message'
        ]

    def get_latest_message(self, obj):
        try:
            latest_message =  obj.messages.latest()
            if latest_message:
                return {
                    "content": latest_message.content,
                    "created_at": latest_message.created_at
                }
            
        except obj.messages.model.DoesNotExist:
            {
                "created_at": obj.created_at
            }