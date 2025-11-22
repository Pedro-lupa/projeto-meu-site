from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Console, BoardGame, Game, PokemonHallOfFame, Platform, Pokemon, Feedback, UserProfile
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
 
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
    hall_of_fame_entry = PokemonHallOfFameSerializer(read_only=True) 
    class Meta:
        model = Game
        fields = [
            'id', 'title', 'cover_image', 'genre', 'platform', 'release_year', 
            'play_time', 'rating', 'observations', 'status',
            'hall_of_fame_entry'
        ]

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at', 'user_email']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["user", "avatar", "bio", "favorite_game", "favorite_boardgame"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password] 
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user