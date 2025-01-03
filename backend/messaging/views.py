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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_message(request):

    data = {
        'sender': request.user.id,
        'chat': request.data.get('chat_id'),
        'recipient': request.data.get('recipient_id'),
        'content': request.data.get('content')
    }

    serializer = CreateMessageSerializer(data=data)

    if serializer.is_valid(raise_exception=True):
        new_mesage = serializer.save()
        return Response(
            MessageSerializer(new_mesage).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


