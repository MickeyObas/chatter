from rest_framework import status, serializers, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from .models import (
    Chat,
    GroupChat
)
from contacts.models import Contact
from .serializers import (
    ChatSerializer,
    ChatDisplaySerializer,
    GroupChatSerializer
)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_list(request):
    try:
        user = request.user
        user_chats = Chat.order_by_latest_message(user)

        serializer = ChatDisplaySerializer(user_chats, many=True)

        return Response(serializer.data)
    
    except Exception as e:
        print(e)
        return Response({'error': str(e)})
    

@api_view(['GET'])
def chat_detail(request, pk):
    try:
        chat = Chat.objects.get(
            id=pk, # Enforce owner = request.user again
        )
    except Chat.DoesNotExist:
        return Response({"message": "Chat does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ChatSerializer(chat)

    return Response(serializer.data)


@api_view(['GET'])
def admin_chat_list(request):
    try:
        user = request.user
        chats = Chat.objects.all()

        serializer = ChatDisplaySerializer(chats, many=True)

        return Response(serializer.data)
    
    except Exception as e:
        print(e)
        return Response({'error': str(e)})
    

@api_view(['GET'])
def chat_detail_by_contact(request, pk):
    try:
        contact = Contact.objects.get(id=pk)

        chat, created = Chat.objects.get_or_create(
            owner=request.user,
            user=contact.contact_user
        )

        serializer = ChatSerializer(chat)

        response =  Response(serializer.data)

        # Was the chat instance created from contct + send message click?
        response.data['was_generated'] = created
    
        return response
    
    except Contact.DoesNotExist:
        return Response({'message': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    except Chat.DoesNotExist:
        return Response({'message': 'Chat does not exist'}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
def set_last_read_message(request, pk):
    try:
        chat = Chat.objects.get(
            id=pk,
            owner=request.user
        )

        chat.last_read_message = chat.messages.latest()
        chat.save()

        return Response({'message': 'Last read message set successfully'})
    
    except Chat.DoesNotExist:
        return Response({'message': 'Chat does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)})
    

@api_view(['POST'])
def set_unread_messages_to_read(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id)
        unread_messages = chat.messages.filter(
            is_read=False
        )

        for unread_message in unread_messages:
            unread_message.is_read = True
            unread_message.save()

        return Response({'message': 'Read status of messages updated'})
    except Exception as e:
        return Response({'error': 'An error occured in changing the read status of messages'}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
def group_chat_detail(request, pk):
    try:
        group_chat = GroupChat.objects.get(id=pk)
        serializer = GroupChatSerializer(group_chat)
        return Response(serializer.data)
    except GroupChat.DoesNotExist:
        return Response({'error': 'Requested Group Chat does not exists.'})


@api_view(['GET'])
def group_chat_list(request):
    user = request.user
    group_chats = GroupChat.objects.filter(
        members__in=[user.id]
    )
    serializer = GroupChatSerializer(group_chats, many=True)
    return Response(serializer.data)
