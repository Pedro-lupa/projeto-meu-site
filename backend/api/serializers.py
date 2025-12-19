from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Achievement,
    Follow, Like, Comment
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

# --- SERIALIZERS DE PERFIL E CONQUISTAS ---

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'username', 'avatar', 'bio', 'favorite_game', 
            'is_public', 'avatar_position', 'profile_views'
        ]

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'image', 'created_at']
        read_only_fields = ['user']

# --- SERIALIZERS SOCIAIS (NOVO) ---

class FollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.ReadOnlyField(source='follower.username')
    followed_username = serializers.ReadOnlyField(source='followed.username')

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'follower_username', 'followed_username', 'created_at']
        read_only_fields = ['follower']

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Like
        fields = ['id', 'user', 'game_entry', 'username', 'created_at']
        read_only_fields = ['user']

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    avatar = serializers.ImageField(source='user.profile.avatar', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'game_entry', 'username', 'avatar', 'text', 'created_at']
        read_only_fields = ['user']

# --- SERIALIZERS DE CONTEÚDO (JOGOS E SETUP) ---

class UserGameEntrySerializer(serializers.ModelSerializer):
    # Inclui contagem de likes e comentários para o feed
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = UserGameEntry
        fields = '__all__'
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
        depth = 1
        read_only_fields = ['user']

class PokemonHallOfFameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonHallOfFame
        fields = '__all__'
        read_only_fields = ['user']