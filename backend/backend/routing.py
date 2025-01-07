from django.urls import re_path, path

from chats import consumers

websocket_urlpatterns = [
    path('ws/chat/private/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
]