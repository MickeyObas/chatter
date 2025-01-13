from rest_framework import serializers

from .models import Chat, GroupChat
from accounts.serializers import UserSummarySerializer
from messaging.serializers import MessageSerializer, GroupChatMessageSerializer


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    owner = UserSummarySerializer()
    user = UserSummarySerializer()
    
    class Meta: 
        model = Chat
        fields = [
            'id',
            'owner',
            'user',
            'messages',
            'created_at',
            'updated_at',
        ]


class ChatDisplaySerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    user = UserSummarySerializer()

    class Meta:
        model = Chat
        fields = [
            'id',
            'user',
            'latest_message',
            'created_at',
            'updated_at',
        ]

    def get_latest_message(self, obj):
        try:
            latest_message =  obj.messages.latest()
            if latest_message:
                return {
                    "content": latest_message.content,
                    "created_at": latest_message.created_at.isoformat(),
                    "is_read": latest_message.is_read
                }
            
        except obj.messages.model.DoesNotExist:
            {
                "created_at": obj.created_at.isoformat()
            }


class GroupChatSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GroupChat
        fields = [
            'id',
            'title',
            'owner',
            'admins',
            'description',
            'messages',
            'picture',
            'members',
            'created_at',
            'updated_at'
        ]

    def get_messages(self, obj):
        messages = obj.groupchatmessage_set.all()
        return GroupChatMessageSerializer(messages, many=True).data
    

class GroupChatDisplaySerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = GroupChat
        fields = [
            'id',
            'title',
            'owner',
            'latest_message',
            'description',
            'picture',
        ]

    def get_latest_message(self, obj):
        try:
            latest_message = obj.groupchatmessage_set.latest()
            if latest_message:
                return {
                    "sender": f"{latest_message.sender.first_name} {latest_message.sender.last_name}",
                    "content": latest_message.content,
                    "created_at": latest_message.created_at.isoformat(),
                }
        except obj.groupchatmessage_set.model.DoesNotExist:
            return None