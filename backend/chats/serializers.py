from rest_framework import serializers

from .models import Chat, GroupChat
from accounts.models import CustomUser
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
    unread_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            'id',
            'user',
            'latest_message',
            'unread_messages_count',
            'created_at',
            'updated_at',
        ]

    def get_unread_messages_count(self, obj):
        return obj.messages.filter(is_read=False).count()

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
    

class GroupChatCreateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    description = serializers.CharField(max_length=300, required=False)
    admins = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all())
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all())
    
    class Meta:
        model = GroupChat
        fields = [
            'title',
            'admins',
            'description',
            'picture',
            'members',
        ]
    
    def create(self, validated_data):
        request = self.context.get('request')
        owner = request.user

        admins = validated_data.pop('admins', [])
        members = validated_data.pop('members', [])

        group_chat = GroupChat.objects.create(owner=owner, **validated_data)

        group_chat.admins.set(admins)
        group_chat.members.set(members)

        return group_chat


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
            'created_at'
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