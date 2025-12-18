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
    Console, BoardGame, UserProfile, Feedback
)
from .serializers import (
    PlatformSerializer, GameCatalogSerializer, UserGameEntrySerializer,
    PokemonSerializer, UserPokemonSerializer, PokemonHallOfFameSerializer,
    ConsoleSerializer, BoardGameSerializer, UserProfileSerializer, FeedbackSerializer
)

# --- VIEWSETS DE SISTEMA (PÚBLICOS/MISTOS) ---

class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [AllowAny] 

class GameCatalogViewSet(viewsets.ModelViewSet):
    queryset = GameCatalog.objects.all()
    serializer_class = GameCatalogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save(created_by=None)

# --- GERENCIAMENTO DE PERFIL (FOTO, BIO E VISUALIZAÇÕES) ---

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser) 

    lookup_field = 'user__username'

    filter_backends = [OrderingFilter]
    ordering_fields = ['profile_views']
    ordering = ['-profile_views'] 

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if self.request.user != instance.user:
            instance.profile_views += 1
            instance.save()
        
        return super().retrieve(request, *args, **kwargs)

    def perform_update(self, serializer):
        if self.request.user == serializer.instance.user:
            serializer.save()
        else:
            raise permissions.PermissionDenied("Você não pode alterar o perfil de outro usuário.")

# --- COLEÇÕES COM MODO SOCIAL (VISITANTE) ---

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

    def create(self, request, *args, **kwargs):
        user = request.user
        pokemon_id = request.data.get('pokemon')
        is_shiny = request.data.get('is_shiny', False)

        # Check for duplicates before saving
        if UserPokemon.objects.filter(user=user, pokemon_id=pokemon_id, is_shiny=is_shiny).exists():
            return Response(
                {'message': 'Você já capturou este Pokémon!'}, 
                status=status.HTTP_200_OK
            )

        return super().create(request, *args, **kwargs)

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

# --- POKÉMON (SISTEMA GERAL) ---

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all().order_by('pokedex_id')
    serializer_class = PokemonSerializer
    permission_classes = [AllowAny]
    pagination_class = None 

# --- FEEDBACK ---

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- SISTEMA DE LOGIN ---

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
             return Response({'error': 'Preencha e-mail e senha'}, status=status.HTTP_400_BAD_REQUEST)

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