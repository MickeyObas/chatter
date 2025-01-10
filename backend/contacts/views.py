from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import (
    Contact
)
from .serializers import ContactSerializer
from accounts.models import CustomUser

from backend.config.redis_client import redis_client



@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def online_contact_list(request):
    try:
        user = request.user

        contacts = Contact.objects.filter(
            user=user
        )
        
        online_users_list = [int(x) for x in list(redis_client.smembers('online_users'))]

        online_contacts = contacts.filter(
            contact_user__id__in=online_users_list
        )

        serializer = ContactSerializer(online_contacts, many=True)

        return Response(serializer.data)

    except CustomUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)})


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


@api_view(['GET'])
def contact_detail(request, pk):
    try:
        contact = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response({'message': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ContactSerializer(contact)

    return Response(serializer.data)