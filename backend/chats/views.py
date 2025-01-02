from rest_framework import status, serializers, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from .models import (
    Chat
)
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