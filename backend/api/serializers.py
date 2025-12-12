from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame
)

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', 'name', 'platform_image']

class GameCatalogSerializer(serializers.ModelSerializer):
    platform = PlatformSerializer(read_only=True)
    class Meta:
        model = GameCatalog
        fields = '__all__'

class PokemonHallOfFameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonHallOfFame
        fields = '__all__'

# --- AQUI ESTÁ A MUDANÇA IMPORTANTE ---
class UserGameEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameEntry
        fields = '__all__'
        # O depth = 1 diz ao Django: "Não mande só o ID. 
        # Entre dentro do 'game_catalog' e me mande o Título, a Imagem e tudo mais."
        depth = 1 

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = '__all__'

class UserPokemonSerializer(serializers.ModelSerializer):
    # Apliquei a mesma lógica aqui para os Pokémon aparecerem com detalhes
    class Meta:
        model = UserPokemon
        fields = '__all__'
        depth = 1

class ConsoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Console
        fields = '__all__'
        read_only_fields = ['user']

class BoardGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardGame
        fields = '__all__'
        read_only_fields = ['user']