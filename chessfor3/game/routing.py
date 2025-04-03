from django.urls import re_path
from game.consumers import ChessConsumer

websocket_urlpatterns = [
    re_path(r"ws/game/$", ChessConsumer.as_asgi()),
]
