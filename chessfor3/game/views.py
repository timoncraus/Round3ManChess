import json
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from .models import Game

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