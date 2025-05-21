from django.urls import path, re_path

from chats import consumers

websocket_urlpatterns = [
    path("ws/notifications/<user_id>/", consumers.NotificationConsumer.as_asgi()),
    path(
        "ws/chat/<str:user_id>/<str:other_user_id>/", consumers.ChatConsumer.as_asgi()
    ),
    path(
        "ws/groupchats/<str:groupchat_id>/<str:user_id>/",
        consumers.GroupChatConsumer.as_asgi(),
    ),
]
