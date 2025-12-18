from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlatformViewSet, 
    GameCatalogViewSet, 
    UserGameEntryViewSet, 
    ConsoleViewSet, 
    BoardGameViewSet,
    PokemonViewSet,           
    UserPokemonViewSet,       
    PokemonHallOfFameViewSet, 
    UserProfileViewSet, # <--- NOVO
    FeedbackViewSet,    # <--- NOVO
    CustomAuthToken
)

router = DefaultRouter()

# --- ROTAS PRINCIPAIS (HOME E BIBLIOTECA) ---
router.register(r'platforms', PlatformViewSet)
router.register(r'games', GameCatalogViewSet) 
router.register(r'library', UserGameEntryViewSet, basename='library') 

# --- ROTAS DE COLEÇÕES ---
router.register(r'consoles', ConsoleViewSet, basename='console')
router.register(r'boardgames', BoardGameViewSet, basename='boardgame')

# --- ROTAS DE POKÉMON ---
router.register(r'pokedex', PokemonViewSet, basename='pokemon') 
router.register(r'user-pokemon', UserPokemonViewSet, basename='user-pokemon')
router.register(r'halloffame', PokemonHallOfFameViewSet, basename='halloffame')

# --- ROTAS SOCIAIS E PERFIL (NOVAS) ---
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', CustomAuthToken.as_view())
]