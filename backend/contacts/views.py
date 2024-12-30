from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import (
    Contact
)
from .serializers import ContactSerializer
from accounts.models import CustomUser


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def contact_list(request):
    try:
        user = request.user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    contacts = Contact.objects.filter(
        user=user
    )
    serializer = ContactSerializer(contacts, many=True)

    return Response(serializer.data)

