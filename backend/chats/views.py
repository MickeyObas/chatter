from rest_framework import status, serializers, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from .models import (
    Chat
)
from contacts.models import Contact
from .serializers import (
    ChatSerializer,
    ChatDisplaySerializer
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
            id=pk,
            owner=request.user
        )
    except Chat.DoesNotExist:
        return Response({"message": "Chat does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ChatSerializer(chat)

    return Response(serializer.data)


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