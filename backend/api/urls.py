from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (ConsoleViewSet, BoardGameViewSet, GameViewSet, PokemonHallOfFameViewSet, PlatformViewSet ,PokemonViewSet, FeedbackCreateView, FeedbackListView,RegisterView,UserProfileView )

router = DefaultRouter()
router.register(r'consoles', ConsoleViewSet)
router.register(r'boardgames', BoardGameViewSet)
router.register(r'games', GameViewSet)
router.register(r'halloffame', PokemonHallOfFameViewSet)
router.register(r'platforms', PlatformViewSet)
router.register(r'pokedex', PokemonViewSet)

urlpatterns = [
    path('', include(router.urls)), 
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('feedback/create/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('feedback/list/', FeedbackListView.as_view(), name='feedback-list'),
]