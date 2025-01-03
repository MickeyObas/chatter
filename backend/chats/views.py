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
    print(request.query_params)
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

        if created:
            print(f"Creating Chat for user:{request.user} + contact:{contact.contact_user.id}")

        serializer = ChatSerializer(chat)

        return Response(serializer.data)
    
    except Contact.DoesNotExist:
        return Response({'message': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    except Chat.DoesNotExist:
        return Response({'message': 'Chat does not exist'}, status=status.HTTP_404_NOT_FOUND)

    