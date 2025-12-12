from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame
)
from .serializers import (
    PlatformSerializer, GameCatalogSerializer, UserGameEntrySerializer,
    PokemonSerializer, UserPokemonSerializer, PokemonHallOfFameSerializer,
    ConsoleSerializer, BoardGameSerializer
)

# --- VIEWSETS DO SEU SITE ---

class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer

class GameCatalogViewSet(viewsets.ModelViewSet):
    queryset = GameCatalog.objects.all()
    serializer_class = GameCatalogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class UserGameEntryViewSet(viewsets.ModelViewSet):
    serializer_class = UserGameEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserGameEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserPokemonViewSet(viewsets.ModelViewSet):
    serializer_class = UserPokemonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPokemon.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConsoleViewSet(viewsets.ModelViewSet):
    serializer_class = ConsoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Console.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BoardGameViewSet(viewsets.ModelViewSet):
    serializer_class = BoardGameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BoardGame.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PokemonHallOfFameViewSet(viewsets.ModelViewSet):
    serializer_class = PokemonHallOfFameSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PokemonHallOfFame.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PokemonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pokemon.objects.all().order_by('pokedex_id')
    serializer_class = PokemonSerializer


# --- NOVA CLASSE DE LOGIN ---

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'E-mail ou senha inválidos'}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username
        })