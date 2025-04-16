from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    winner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    duration = models.DurationField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('waiting', 'В ожидании'),
        ('in_progress', 'Идет игра'),
        ('finished', 'Закончена')
    ])
    state = models.TextField(default="{}")

    def __str__(self):
        return f"Game #{self.id}"
