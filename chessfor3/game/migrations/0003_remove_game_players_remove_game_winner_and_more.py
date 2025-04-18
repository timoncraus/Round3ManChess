# Generated by Django 4.2.20 on 2025-04-16 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_game_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='players',
        ),
        migrations.RemoveField(
            model_name='game',
            name='winner',
        ),
        migrations.AlterField(
            model_name='game',
            name='status',
            field=models.CharField(choices=[('in_progress', 'Идет игра'), ('finished', 'Закончена')], max_length=20),
        ),
    ]
