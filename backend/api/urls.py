from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlatformViewSet, GameCatalogViewSet, UserGameEntryViewSet,
    PokemonViewSet, UserPokemonViewSet, PokemonHallOfFameViewSet,
    ConsoleViewSet, BoardGameViewSet
)

router = DefaultRouter()

router.register(r'platforms', PlatformViewSet)
router.register(r'catalog', GameCatalogViewSet)
router.register(r'pokedex-ref', PokemonViewSet) 

router.register(r'my-games', UserGameEntryViewSet, basename='my-games')
router.register(r'my-pokedex', UserPokemonViewSet, basename='my-pokedex')
router.register(r'consoles', ConsoleViewSet, basename='consoles')
router.register(r'boardgames', BoardGameViewSet, basename='boardgames')
router.register(r'halloffame', PokemonHallOfFameViewSet, basename='halloffame')

urlpatterns = [
    path('', include(router.urls)),
]