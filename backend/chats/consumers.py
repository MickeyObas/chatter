# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
import json

from chats.models import Chat
from accounts.models import CustomUser
from messaging.serializers import (
    CreateMessageSerializer, 
    MessageSerializer
)

@database_sync_to_async
def get_chat(chat_id):
    chat = Chat.objects.get(id=chat_id)
    return {
        "id": chat.user.id,
        "email": chat.user.email
    }


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

        print("ROOM NAME", self.room_group_name)

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
            await database_sync_to_async(recipient_serializer.save)()

            # Update the last read message for the owner chat
            owner_chat.last_read_message = new_message
            await database_sync_to_async(owner_chat.save)()

            print("All good")

        # Send the message to the group asynchronously
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'chat.message',
                    'data': MessageSerializer(new_message).data
                }
            )

    async def chat_message(self, event):
        # Handle incoming chat message event
        data = event['data']
        await self.send(text_data=json.dumps(data))
