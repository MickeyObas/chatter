from rest_framework import status, serializers, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from .models import (
    Message
)

from .serializers import (
    MessageSerializer,
    CreateMessageSerializer
)


@api_view(['POST'])
def create_message(request):

    data = {
        'sender': request.user.id,
        'chat': request.data.get('chat_id'),
        'recipient': request.data.get('recipient_id'),
        'content': request.data.get('content')
    }

    print(data)

    serializer = CreateMessageSerializer(data=data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response({'message': 'Message created'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


