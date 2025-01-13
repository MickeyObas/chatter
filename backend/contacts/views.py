from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import (
    Contact
)
from .serializers import ContactSerializer
from accounts.models import CustomUser

from backend.config.redis_client import redis_client
import json



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


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def contact_list_create(request):
    if request.method == 'GET':
        try:
            user = request.user
        except CustomUser.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        contacts = Contact.objects.filter(
            user=user
        )
        serializer = ContactSerializer(contacts, many=True)

        return Response(serializer.data)
    else:
        try:
            data = json.loads(request.body)
            user = request.user
            contact_user = CustomUser.objects.get(
                email=data['email']
            )

            # User trying to add themself as a contact
            if contact_user == user:
                return Response({
                    'error': 'You cannot add yourself as a contact.'
                })
            
            # User trying to add already existing contact
            if Contact.objects.filter(
                user=user,
                contact_user=contact_user
            ).exists():
                return Response({
                    'error': f'You already have user "{data['email']}" as a contact.'
                })

            new_contact = Contact.objects.create(
                user=user,
                contact_user=contact_user
            )
            new_contact.save()

            contacts = Contact.objects.filter(
                user=user
            )

            serializer = ContactSerializer(contacts, many=True)

            return Response({
                'message': 'Contact Added Successfully',
                'contacts': serializer.data
            })
        except CustomUser.DoesNotExist:
            return Response({
                'error': f'User with email address "{data['email']}" does not exist in our records'
            })
        except Exception as e:
            return Response({
                'error': str(e)
            })


@api_view(['GET', 'DELETE'])
def contact_detail_or_delete(request, pk):
    try:
        contact = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response({'message': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ContactSerializer(contact)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        