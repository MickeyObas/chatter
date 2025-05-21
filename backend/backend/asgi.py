import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path, re_path

from backend.routing import websocket_urlpatterns
from chats.consumers import OnlineUserSSEConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": URLRouter(
            [
                re_path(r"^sse/online-users/$", OnlineUserSSEConsumer.as_asgi()),
                re_path(r"/", django_asgi_app),
            ]
        ),
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
