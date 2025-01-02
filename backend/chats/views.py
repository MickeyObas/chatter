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
