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
from chats.models import Chat
from accounts.models import CustomUser


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
        
        # Save both message instances, but return data from owner instance
        new_mesage = owner_serializer.save()
        recipient_serializer.save()

        return Response(
            MessageSerializer(new_mesage).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


