from django.contrib import admin
from django.urls import path
from game.views import *
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('lobby/', lobby, name='lobby'),
    path('game/<int:game_id>/', game_room, name='game_room'),
    path('sandbox/', sandbox, name='sandbox'),
    path('sandbox_crazy/', sandbox_crazy, name='sandbox_crazy'),
    path('rules/', rules, name='rules'),

     # Аутентификация
    path('accounts/login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/register/', register, name='register'),
]
