from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from .serializers import (
    MessageSerializer,
    CreateMessageSerializer
)
from chats.models import Chat, GroupChat
from accounts.models import CustomUser
from .models import (
    GroupChatMessageReadStatus
)   


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_message(request):

    sender = request.user
    recipient = CustomUser.objects.get(
        id=request.data.get('recipient_id')
    )
    content = request.data.get('content')

    owner_chat, owner_chat_created = Chat.objects.get_or_create(
        owner=sender,
        user=recipient
    )

    recipient_chat, recipient_chat_created = Chat.objects.get_or_create(
        owner=recipient,
        user=sender
    )

    owner_data = {
        'sender': sender.id,
        'recipient': recipient.id,
        'chat': owner_chat.id,
        'content': content
    }

    recipient_data = {
        'sender': sender.id,
        'recipient': recipient.id,
        'chat': recipient_chat.id,
        'content': content
    }

    owner_serializer = CreateMessageSerializer(data=owner_data)
    recipient_serializer = CreateMessageSerializer(data=recipient_data)

    if owner_serializer.is_valid(raise_exception=True) and recipient_serializer.is_valid(raise_exception=True):
        
        # Save both message instances, but return data ONLY from owner instance
        new_mesage = owner_serializer.save()
        recipient_serializer.save()

        # Set new_message as last_read_message for the owner's chat
        owner_chat.last_read_message = new_mesage
        owner_chat.save()

        response = Response(
            MessageSerializer(new_mesage).data,
            status=status.HTTP_201_CREATED
        )

        return response
    
    return Response(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def mark_group_messages_as_read(request, groupchat_id):
    user = request.user
    groupchat = GroupChat.objects.get(id=groupchat_id)

    # Get the unread messages for the group
    last_read_group_message_timestamp = GroupChatMessageReadStatus.objects.filter(
        user=user,
        message__groupchat=groupchat_id
    )

    # If no last read message, user has not read any message in the group
    if not last_read_group_message_timestamp.exists():
        unread_messages = groupchat.groupchatmessage_set.all().exclude(
            sender=user
        )
    else:
        last_read_group_message = last_read_group_message_timestamp.latest()
        time_boundary = last_read_group_message.read_at
        unread_messages = groupchat.groupchatmessage_set.filter(
            created_at__gte=time_boundary
        ).exclude(sender=user)

    message_ids = unread_messages.values_list('id', flat=True)

    # Create GCMRS objects for all of them
    read_status = [
        GroupChatMessageReadStatus(message_id=msg_id, user_id=user.id, read_at=timezone.now())
        for msg_id in message_ids
    ]

    GroupChatMessageReadStatus.objects.bulk_create(read_status, ignore_conflicts=True)

    return Response({'test': 'successful'})    

    