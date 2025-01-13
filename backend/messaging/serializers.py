from rest_framework import serializers

from .models import Message, GroupChatMessage
from accounts.serializers import UserSummarySerializer

class MessageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Message
        fields = [
            'sender',
            'recipient',
            'content',
            'is_read',
            'chat',
            'created_at',
            'updated_at'
        ]


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'sender',
            'recipient',
            'content',
            'chat',
        ]

    def create(self, validated_data):
        return Message.objects.create(**validated_data)
    

class GroupChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupChatMessage
        fields = [
            'groupchat',
            'sender',
            'content',
            'created_at',
            'updates_at'
        ]