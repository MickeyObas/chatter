from django.urls import re_path, path

from chats import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:user_id>/<str:other_user_id>/', consumers.ChatConsumer.as_asgi()),
]