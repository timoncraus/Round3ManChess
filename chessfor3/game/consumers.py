import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import sync_to_async
from pathlib import Path
from .models import Game
import random

class LobbyConsumer(AsyncWebsocketConsumer):
    players = []
    player_colors = {}
    colors = ['white', 'black', 'gray']

    async def connect(self):
        await self.accept()
        self.players.append(self)

        if len(self.players) == 3:
            path = Path(__file__).resolve().parents[2] / 'chessfor3/static/json/initial_state_game.json'
            with open(path, encoding='utf-8') as f:
                initial_state = json.load(f)

            game = await sync_to_async(Game.objects.create)(status='in_progress', state=json.dumps(initial_state))
            game_id = game.id

            # Случайно распределяем цвета между игроками
            random.shuffle(self.colors)
            for i, player in enumerate(self.players):
                player_color = self.colors[i]
                # Отправляем данные конкретному игроку
                await player.send(text_data=json.dumps({
                    'action': 'start_game',
                    'game_id': game_id,
                    'color': player_color
                }))
                print(f"Sent {player_color} to {player}")

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
            game = await sync_to_async(Game.objects.get)(id=self.game_id)
            state_dict = json.loads(game.state)

            for clear_cell in data['clear']:
                if clear_cell in state_dict['figures_pos']:
                    state_dict['figures_pos'].pop(clear_cell)

            for edit_cell, figure_name in data['edit_new'].items():
                state_dict['figures_pos'][edit_cell] = figure_name

            state_dict['turn'] = data['turn']
            state_dict['captured_figures'] = data['captured_figures']
            state_dict['eliminated_players'] = data['eliminated_players']
            state_dict['double_pawns'] = data['double_pawns']

            if state_dict['eliminated_players'][state_dict['turn']]:
                if state_dict['turn'] == "white":
                    state_dict['turn'] = "gray"
                elif state_dict['turn'] == "gray":
                    state_dict['turn'] = "black"
                elif state_dict['turn'] == "black":
                    state_dict['turn'] = "white"

            game.state = json.dumps(state_dict)
            await sync_to_async(game.save)()
            
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
