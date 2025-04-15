import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import sync_to_async
from .models import Game

class LobbyConsumer(AsyncWebsocketConsumer):
    players = []

    async def connect(self):
        await self.accept()
        self.players.append(self)

        if len(self.players) == 3:
            # создаём игру
            game = await sync_to_async(Game.objects.create)(status='in_progress')
            game_id = game.id
            for player in self.players:
                await player.send(text_data=json.dumps({
                    'action': 'start_game',
                    'game_id': game_id,
                }))
            self.players.clear()

    async def disconnect(self, close_code):
        if self in self.players:
            self.players.remove(self)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'move':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'broadcast_move',
                    'to_cell_id': data['to_cell_id'],
                    'from_cell_id': data['from_cell_id'],
                }
            )

    async def broadcast_move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move',
            'to_cell_id': event['to_cell_id'],
            'from_cell_id': event['from_cell_id'],
        }))
