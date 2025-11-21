from rest_framework import viewsets
from .models import Console, BoardGame, Game, PokemonHallOfFame, Platform, Pokemon
from .serializers import ConsoleSerializer, BoardGameSerializer, GameSerializer, PokemonHallOfFameSerializer, PlatformSerializer, PokemonSerializer

class ConsoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Console.objects.all()
    serializer_class = ConsoleSerializer

class BoardGameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BoardGame.objects.all()
    serializer_class = BoardGameSerializer

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class PokemonHallOfFameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PokemonHallOfFame.objects.all()
    serializer_class = PokemonHallOfFameSerializer

class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all().order_by('pokedex_id')
    serializer_class = PokemonSerializer

    http_method_names = ['get', 'patch', 'head', 'options']