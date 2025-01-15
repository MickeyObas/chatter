from rest_framework import status, serializers, permissions, parsers
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes
)

from .models import (
    Chat,
    GroupChat,
    UserGroupContactColorMap
)
from accounts.models import CustomUser
from contacts.models import Contact
from .serializers import (
    ChatSerializer,
    ChatDisplaySerializer,
    GroupChatSerializer,
    GroupChatDisplaySerializer,
    GroupChatCreateSerializer
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
        serializer = GroupChatSerializer(group_chat, context={'user_id': request.user.id})
        return Response(serializer.data)
    except GroupChat.DoesNotExist:
        return Response({'error': 'Requested Group Chat does not exists.'})


@api_view(['GET', 'POST'])
@parser_classes([parsers.JSONParser, parsers.MultiPartParser])
def group_chat_list_or_create(request):
    user = request.user
    # group_chats = GroupChat.objects.filter(
    #     members__in=[user.id]
    # )
    if request.method == 'GET':
        group_chats = GroupChat.order_by_latest_message(user)
        serializer = GroupChatDisplaySerializer(group_chats, many=True, context={"user_id": user.id})
        return Response(serializer.data)
    else:
        data = request.data
        title = data['title'].strip()
        picture = data.get('picture', None)
        member_ids = [int(x) for x in data['members'].split(',')] + [user.id]
        admin_ids = [user.id]

        group_chat_data = dict()
        group_chat_data['title'] = title
        group_chat_data['picture'] = picture
        group_chat_data['members'] = member_ids
        group_chat_data['admins'] = admin_ids
    
        print(group_chat_data)

        serializer = GroupChatCreateSerializer(data=group_chat_data, context={'request': request})

        if serializer.is_valid():
            new_group_chat = serializer.save()

            # TODO: Take every member of the group and create a UGCCM for each
            for user_member in new_group_chat.members.all():
                for other_member in new_group_chat.members.exclude(
                    id=user_member.id
                ):
                    UserGroupContactColorMap.objects.create(
                        user=user_member,
                        group=new_group_chat,
                        contact_user=other_member
                    )

            serializer = GroupChatDisplaySerializer(new_group_chat, context={"user_id": user.id})
            return Response(serializer.data)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_contact_to_group(request, groupchat_id):
    try:
        groupchat = GroupChat.objects.get(id=groupchat_id)
        user_email = request.data['email'].strip().lower()

        if user_email == request.user.email:
            return Response({
                'error': "You can not add yourself AGAIN to a group chat. You already know this because you are quite literally the creator/owner of this group."
            })

        user_to_add = CustomUser.objects.get(email=user_email)
        
        if not Contact.objects.filter(
            user=request.user,
            contact_user=user_to_add
        ).exists():
            return Response({
                'error': f'There is no user with email "{user_email} on your contact list."'
            })

        if groupchat.members.filter(email=user_email):
            return Response({
                'error': f'User "{user_email} is already a member of this group chat."'
            })

        groupchat.members.add(user_to_add)
        groupchat.save()

        for member in groupchat.members.exclude(
            id=user_to_add.id
        ):
            UserGroupContactColorMap.objects.create(
                user=user_to_add,
                group=groupchat,
                contact_user=member
            ) 

            UserGroupContactColorMap.objects.create(
                user=member,
                group=groupchat,
                contact_user=user_to_add
            )

        return Response({'message': 'User added to group successfully'})
    
    except CustomUser.DoesNotExist:
        return Response({
            'error': f'User with email address {user_email} does not exist in our records.'
        })