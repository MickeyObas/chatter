# consumers.py
from channels.generic.websocket import (
    AsyncWebsocketConsumer,
)
from channels.generic.http import AsyncHttpConsumer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import json

from chats.models import Chat, GroupChat
from messaging.models import Message, GroupChatMessage
from accounts.models import CustomUser
from accounts.serializers import (
    UserSummarySerializer, 
    UserSerializer
)
from messaging.serializers import (
    CreateMessageSerializer, 
    MessageSerializer,
    GroupChatMessageSerializer,
    CreateGroupChatMessageSerializer
)
from chats.serializers import (
    ChatSerializer,
    ChatDisplaySerializer,
    GroupChatSerializer,
    GroupChatDisplaySerializer
)
from backend.config.redis_client import redis_client
import asyncio
from channels.exceptions import StopConsumer


@database_sync_to_async
def get_chat_display(chat_id):
    chat = Chat.objects.get(id=chat_id)
    owner = chat.owner
    messages_qs = chat.messages.all()
    response = ChatDisplaySerializer(chat).data
    response['messages'] = MessageSerializer(messages_qs, many=True).data
    response['owner'] = UserSummarySerializer(owner).data
    return response 

@database_sync_to_async
def get_chat_detail(chat_id):
    chat = Chat.objects.get(id=chat_id)
    return ChatSerializer(chat).data

@database_sync_to_async
def get_message(message_id):
    message = Message.objects.get(id=message_id)
    return MessageSerializer(message).data

@database_sync_to_async
def get_group_chat(groupchat_id, user_id):
    groupchat = GroupChat.objects.get(id=groupchat_id)
    return GroupChatDisplaySerializer(groupchat, context={'user_id': user_id}).data

@database_sync_to_async
def get_group_chat_detail(groupchat_id, user_id):
    groupchat = GroupChat.objects.get(id=groupchat_id)
    return GroupChatSerializer(groupchat, context={'user_id': user_id}).data


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.other_user_id = self.scope['url_route']['kwargs']['other_user_id']
        
        # Generate unique name for chat between both users
        self.room_name = f"chat_{'_'.join(sorted([self.user_id, self.other_user_id]))}"
        self.room_group_name = self.room_name

        # Add the current WebSocket connection to the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):

        # Remove the WebSocket connection from the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Get sender ID
        data = json.loads(text_data)
        
        sender_id = data['sender_id']
        recipient_id = data['recipient_id']
        content = data['content']

        # Get sender and receiver User objects asynchronously
        sender = await database_sync_to_async(CustomUser.objects.get)(id=sender_id)
        recipient = await database_sync_to_async(CustomUser.objects.get)(id=recipient_id)

        # Get (or create) their individual chats
        owner_chat, owner_chat_created = await database_sync_to_async(Chat.objects.get_or_create)(owner=sender, user=recipient)
        recipient_chat, recipient_chat_created = await database_sync_to_async(Chat.objects.get_or_create)(owner=recipient, user=sender)

        # Prepare data to be serialized
        owner_data = {
            'sender': sender.id,
            'recipient': recipient.id,
            'chat': owner_chat.id,
            'content': content
        }

        recipient_data = {
            'sender': sender.id,
            'recipient': recipient.id,
            'chat': recipient_chat.id,
            'content': content
        }

        # Serialize the data for both chats
        owner_serializer = CreateMessageSerializer(data=owner_data)
        recipient_serializer = CreateMessageSerializer(data=recipient_data)

        # Validate and save messages asynchronously
        if await database_sync_to_async(owner_serializer.is_valid)(raise_exception=True) and await database_sync_to_async(recipient_serializer.is_valid)(raise_exception=True):
            new_message = await database_sync_to_async(owner_serializer.save)()
            recipient_new_message = await database_sync_to_async(recipient_serializer.save)()

            # Update the read_status of latest_message for sender
            new_message.is_read = True
            await database_sync_to_async(new_message.save)()            

            # Update the last read message for the owner chat
            owner_chat.last_read_message = new_message
            await database_sync_to_async(owner_chat.save)()

        # Send the message to the group asynchronously
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'chat.message',
                    'data': MessageSerializer(new_message).data,
                    'chat_id': owner_chat.id
                }
            )

            # Send a notification to the recipient user group
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                f"user_{recipient_id}",
                {
                    'type': 'send_notification',
                    'notification': {
                        'type': 'new_message',
                        'message_id': recipient_new_message.id,
                        'chat_id': recipient_chat.id,
                    }
                }
            )
        
    async def chat_message(self, event):
        # Handle incoming chat message event
        data = event['data']
        chat_id = event['chat_id']
        chat = await get_chat_display(chat_id)
        data['chat'] = chat
        await self.send(text_data=json.dumps(data))


# Notifications
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(type(redis_client))
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        print(f"Connected as {self.user_id}")
        self.user_group_name = f"user_{self.user_id}"
        
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.channel_layer.group_add(
            "online_users",
            self.channel_name
        )

        if not redis_client.sismember('online_users', self.user_id):
            redis_client.sadd("online_users", self.user_id)
        
        await self.accept()

        await self.channel_layer.group_send(
            "online_users",
            {
                "type": "user.online",
                "user_id": self.user_id
            }    
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "online_users",
            self.channel_name
        )

        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_send(
            "online_users",
            {
                "type": "user.offline",
                "user_id": self.user_id
            }
        )

        channel_layer = get_channel_layer()

        redis_client.srem("online_users", self.user_id)

    async def receive(self, text_data):
        # Handle incoming messages from the client (optional)
        data = json.loads(text_data)

    async def send_notification(self, event):
        # Send notification to the user
        notification = event['notification']
        chat_id = event['notification']['chat_id']
        message_id = event['notification']['message_id']

        chat = await get_chat_display(chat_id)
        message = await get_message(message_id)

        notification['chat'] = chat
        notification['message'] = message

        await self.send(text_data=json.dumps(notification))

    async def user_online(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_came_online',
            'message': f"User {event['user_id']} just came online!"
        }))

    async def user_offline(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_went_offline',
            'message': f"User {event['user_id']} just went offline!"
        }))

    async def notification_group_message(self, event):
        groupchat = await get_group_chat(event['groupchat_id'], self.user_id)
        event['groupchat'] = groupchat
        event['type'] = 'groupchat_message'
        await self.send(text_data=json.dumps(event))


class OnlineUserSSEConsumer(AsyncHttpConsumer):
    async def handle(self, body):
       
        await self.send_headers(
            headers=[
                (b"Access-Control-Allow-Origin", b"http://localhost:5173"),
                (b"Access-Control-Allow-Credentials", b"true"),
                (b"Content-Type", b"text/event-stream"),
                (b"Cache-Control", b"no-cache"),
                (b"Connection", b"keep-alive"),
            ]
        )

        try:
            while True:
                # Fetch online users from cache
                online_users = online_users_list = [int(x) for x in list(redis_client.smembers('online_users'))]
                message = f"data: {online_users}\n\n"
                await self.send_body(message.encode("utf-8"), more_body=True)
                await asyncio.sleep(5)  # Send updates every 5 seconds
        except asyncio.CancelledError:
            raise StopConsumer()
        except Exception:
            raise StopConsumer()

    async def disconnect(self):
        return await super().disconnect()
    
    async def http_disconnect(self, message):
        return await super().http_disconnect(message)
    

class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.groupchat_id = self.scope['url_route']['kwargs']['groupchat_id']
        self.group_chat_name = f"user_{self.groupchat_id}"

        await self.channel_layer.group_add(
            self.group_chat_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_chat_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        groupchat = await database_sync_to_async(GroupChat.objects.get)(id=data['groupchat_id'])
        sender = await database_sync_to_async(CustomUser.objects.get)(id=data['sender_id'])
        content = data['content']
        
        # Serialize data
        message_data = {
            'sender': sender.id,
            'groupchat': groupchat.id,
            'content': content
        }

        group_chat_message_serializer = CreateGroupChatMessageSerializer(data=message_data)

        # Create message in DB
        if await database_sync_to_async(group_chat_message_serializer.is_valid)(raise_exception=True):
            new_groupchat_message = await database_sync_to_async(group_chat_message_serializer.save)()

            await self.channel_layer.group_send(
                self.group_chat_name, {
                    'type': 'groupchat.message',
                    'data': GroupChatMessageSerializer(new_groupchat_message).data,
                    'groupchat_id': new_groupchat_message.groupchat.id
                }
            )

            # Send to each user
            groupchat_data = await get_group_chat_detail(new_groupchat_message.groupchat.id, self.user_id)

            for member_id in groupchat_data['members']:
                await self.channel_layer.group_send(
                    f"user_{member_id}", {
                        'type': 'notification.group.message',
                        'data': GroupChatMessageSerializer(new_groupchat_message).data,
                        'groupchat_id': new_groupchat_message.groupchat.id
                    }
                )

    async def groupchat_message(self, event):
        groupchat = await get_group_chat(event['groupchat_id'], self.user_id)
        event['groupchat'] = groupchat
        await self.send(text_data=json.dumps(event))