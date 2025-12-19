from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser 
from rest_framework.filters import OrderingFilter 

from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Achievement,
    Follow, Like, Comment
)
from .serializers import (
    PlatformSerializer, GameCatalogSerializer, UserGameEntrySerializer,
    PokemonSerializer, UserPokemonSerializer, PokemonHallOfFameSerializer,
    ConsoleSerializer, BoardGameSerializer, UserProfileSerializer, 
    AchievementSerializer, FollowSerializer, LikeSerializer, CommentSerializer
)

# --- SISTEMA DE LOGIN ---
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
            'username': user.username
        })

# --- PERFIL E BIO (CORRIGIDO PARA SALVAR) ---
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser) 
    lookup_field = 'user__username'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrementa views se o visitante não for o dono
        if request.user.is_authenticated and request.user != instance.user:
            instance.profile_views += 1
            instance.save()
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Força o partial=True para que o PATCH de Bio funcione sem exigir a foto
        kwargs['partial'] = True
        instance = self.get_object()
        if request.user != instance.user:
            return Response({"error": "Não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

# --- GALERIA E DESTAQUES ---
class AchievementViewSet(viewsets.ModelViewSet):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return Achievement.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return Achievement.objects.filter(user=self.request.user)
        return Achievement.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- COLEÇÕES (CORRIGIDO FILTRO DE SETUP/CONSOLES) ---
class ConsoleViewSet(viewsets.ModelViewSet):
    serializer_class = ConsoleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return Console.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return Console.objects.filter(user=self.request.user)
        return Console.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserGameEntryViewSet(viewsets.ModelViewSet):
    serializer_class = UserGameEntrySerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return UserGameEntry.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return UserGameEntry.objects.filter(user=self.request.user)
        return UserGameEntry.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- SISTEMA SOCIAL (SEGUIR, CURTIR, COMENTAR) ---
class FollowViewSet(viewsets.ModelViewSet):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- VIEWSETS DE CATÁLOGO (POKÉMON, PLATAFORMAS, JOGOS) ---
class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [AllowAny] 

class GameCatalogViewSet(viewsets.ModelViewSet):
    queryset = GameCatalog.objects.all()
    serializer_class = GameCatalogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all().order_by('pokedex_id')
    serializer_class = PokemonSerializer
    permission_classes = [AllowAny]
    pagination_class = None 

class UserPokemonViewSet(viewsets.ModelViewSet):
    serializer_class = UserPokemonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return UserPokemon.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return UserPokemon.objects.filter(user=self.request.user)
        return UserPokemon.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PokemonHallOfFameViewSet(viewsets.ModelViewSet):
    serializer_class = PokemonHallOfFameSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return PokemonHallOfFame.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return PokemonHallOfFame.objects.filter(user=self.request.user)
        return PokemonHallOfFame.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BoardGameViewSet(viewsets.ModelViewSet):
    serializer_class = BoardGameSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        target_username = self.request.query_params.get('username')
        if target_username:
            return BoardGame.objects.filter(user__username=target_username)
        if self.request.user.is_authenticated:
            return BoardGame.objects.filter(user=self.request.user)
        return BoardGame.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)