from rest_framework import serializers
from .models import Console, BoardGame, Game, PokemonHallOfFame, Platform

class ConsoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Console
        fields = ['id', 'name', 'photo']

class BoardGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardGame
        fields = '__all__'

class PokemonHallOfFameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonHallOfFame
        fields = '__all__'

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', 'name', 'platform_image']

class GameSerializer(serializers.ModelSerializer):

    platform = PlatformSerializer(read_only=True) 
    class Meta:
        model = Game
        fields = [
            'id', 'title', 'cover_image', 'genre', 'platform', 'release_year', 
            'play_time', 'rating', 'observations', 'status',
            'hall_of_fame_entry'
        ]