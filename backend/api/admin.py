from django.contrib import admin
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Feedback
)

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(GameCatalog)
class GameCatalogAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'release_year', 'genre')
    search_fields = ('title',)

@admin.register(UserGameEntry)
class UserGameEntryAdmin(admin.ModelAdmin):

    list_display = ('user', 'get_game_title', 'status', 'rating')
    list_filter = ('user', 'status')
    search_fields = ('game_catalog__title', 'user__username')

    def get_game_title(self, obj):
        return obj.game_catalog.title
    get_game_title.short_description = 'Jogo'

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = ('pokedex_id', 'name', 'type1')
    search_fields = ('name', 'pokedex_id')

@admin.register(UserPokemon)
class UserPokemonAdmin(admin.ModelAdmin):
    list_display = ('user', 'pokemon', 'is_shiny', 'captured_at')
    list_filter = ('user', 'is_shiny')

@admin.register(Console)
class ConsoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)

@admin.register(BoardGame)
class BoardGameAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_public')

admin.site.register(PokemonHallOfFame)
admin.site.register(Feedback)