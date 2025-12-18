from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Feedback
)

# --- SERIALIZERS DE SISTEMA ---

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', 'name', 'platform_image']

class GameCatalogSerializer(serializers.ModelSerializer):
    platform = PlatformSerializer(read_only=True)
    
    class Meta:
        model = GameCatalog
        fields = '__all__'
        read_only_fields = ['created_by']

# --- SERIALIZERS DE PERFIL E USUÁRIO ---

class UserProfileSerializer(serializers.ModelSerializer):
    # Trazemos dados do User padrão do Django para facilitar a exibição
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'avatar', 'bio', 'favorite_game', 'is_public']

# --- SERIALIZERS DE CONTEÚDO (JOGOS E COLEÇÕES) ---

class UserGameEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameEntry
        fields = '__all__'
        # O depth = 1 expande o 'game_catalog' para trazer título, imagem, etc.
        depth = 1 
        read_only_fields = ['user']

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

# --- SERIALIZERS DE POKÉMON ---

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = '__all__'

class UserPokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPokemon
        fields = '__all__'
        # depth = 1 para trazer o sprite e nome do Pokémon, não só o ID
        depth = 1
        read_only_fields = ['user']

class PokemonHallOfFameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonHallOfFame
        fields = '__all__'
        read_only_fields = ['user']

# --- OUTROS ---

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['user', 'created_at']