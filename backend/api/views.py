from rest_framework import viewsets, generics, permissions
from .models import Console, BoardGame, Game, PokemonHallOfFame, Platform, Pokemon, Feedback
from .serializers import ConsoleSerializer, BoardGameSerializer, GameSerializer, PokemonHallOfFameSerializer, PlatformSerializer, PokemonSerializer, FeedbackSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserProfile

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

class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedbackListView(generics.ListAPIView):
    queryset = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAdminUser]

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

    permission_classes = [permissions.IsAuthenticated]