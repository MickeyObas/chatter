from rest_framework import serializers

from .models import Chat, GroupChat
from messaging.models import Message, GroupChatMessageReadStatus
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
                    "sender": latest_message.sender.id,
                    "content": latest_message.content,
                    "created_at": latest_message.created_at.isoformat(),
                    "is_read": latest_message.is_read
                }
            
        except obj.messages.model.DoesNotExist:
            return None


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
    unread_messages_count = serializers.SerializerMethodField()
    total_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = GroupChat
        fields = [
            'id',
            'title',
            'owner',
            'latest_message',
            'total_messages_count',
            'unread_messages_count',
            'description',
            'picture',
            'created_at'
        ]

    def get_unread_messages_count(self, obj):
        user_id = self.context.get('user_id')
        user = CustomUser.objects.get(id=user_id)

        last_read_group_message_timestamp = GroupChatMessageReadStatus.objects.filter(
            user=user,
            message__groupchat=obj.id
        )

        if not last_read_group_message_timestamp.exists():
            unread_messages = obj.groupchatmessage_set.all().exclude(
                sender=user
            )
        else:
            last_read_group_message = last_read_group_message_timestamp.latest()
            time_boundary = last_read_group_message.read_at
            unread_messages = obj.groupchatmessage_set.filter(
                created_at__gte=time_boundary
            ).exclude(sender=user)

        return unread_messages.count()

    def get_total_messages_count(self, obj):
        return obj.groupchatmessage_set.count()
        
    def get_latest_message(self, obj):
        try:
            latest_message = obj.groupchatmessage_set.latest()
            if latest_message:
                return {
                    "sender": latest_message.sender.id,
                    "content": latest_message.content,
                    "created_at": latest_message.created_at.isoformat(),
                }
        except obj.groupchatmessage_set.model.DoesNotExist:
            return None