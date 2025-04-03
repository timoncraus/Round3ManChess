import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChessConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "chess_room"
        self.room_group_name = f"game_{self.room_name}"

        # Присоединяемся к группе
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        move = data["move"]

        # Отправляем ход другим игрокам
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_move",
                "move": move
            }
        )

    async def game_move(self, event):
        move = event["move"]

        # Отправляем ход всем подключенным клиентам
        await self.send(text_data=json.dumps({"move": move}))
