from django.contrib import admin
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Achievement
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_views', 'is_public')
    search_fields = ('user__username', 'bio')

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')

admin.site.register(Platform)
admin.site.register(GameCatalog)
admin.site.register(UserGameEntry)
admin.site.register(Pokemon)
admin.site.register(UserPokemon)
admin.site.register(PokemonHallOfFame)
admin.site.register(Console)
admin.site.register(BoardGame)