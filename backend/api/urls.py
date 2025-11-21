from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsoleViewSet, BoardGameViewSet, GameViewSet, PokemonHallOfFameViewSet, PlatformViewSet, PokemonViewSet

router = DefaultRouter()
router.register(r'consoles', ConsoleViewSet)
router.register(r'boardgames', BoardGameViewSet)
router.register(r'games', GameViewSet)
router.register(r'halloffame', PokemonHallOfFameViewSet)
router.register(r'platforms', PlatformViewSet)
router.register(r'pokedex', PokemonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]