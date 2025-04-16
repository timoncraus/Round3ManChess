import json
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from .models import Game
from pathlib import Path

def home(request):
    games = Game.objects.filter().order_by('-ended_at')
    return render(request, 'home.html', {'games': games})

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # авторизация после регистрации
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def lobby(request):
    return render(request, 'lobby.html')

def game_room(request, game_id):
    game = Game.objects.get(id=game_id)
    return render(request, 'game/index.html', {'game_id': game.id, 'game_state_json': json.dumps(game.state)})

def sandbox(request):
    path = Path(__file__).resolve().parents[2] / 'chessfor3/static/json/initial_state_game.json'
    with open(path, encoding='utf-8') as f:
        initial_state = json.load(f)
    return render(request, 'game/index.html', {'game_id': 'sandbox', 'game_state_json': json.dumps(initial_state)})

def sandbox_crazy(request):
    path = Path(__file__).resolve().parents[2] / 'chessfor3/static/json/initial_state_game.json'
    with open(path, encoding='utf-8') as f:
        initial_state = json.load(f)
    return render(request, 'game/index.html', {'game_id': 'sandbox-crazy', 'game_state_json': json.dumps(initial_state)})