from django.contrib import admin
from .models import (
    Platform, GameCatalog, UserGameEntry, 
    Pokemon, UserPokemon, PokemonHallOfFame, 
    Console, BoardGame, UserProfile, Feedback
)

# --- CONFIGURAÇÃO DO PERFIL (COM VISUALIZAÇÕES) ---
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    # Mostra o usuário, se é público e QUANTAS VISITAS teve
    list_display = ('user', 'profile_views', 'is_public', 'favorite_game')
    search_fields = ('user__username', 'bio')
    list_filter = ('is_public',)
    ordering = ('-profile_views',) # Ordena por mais vistos

# --- JOGOS E PLATAFORMAS ---

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(GameCatalog)
class GameCatalogAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'release_year', 'genre', 'created_by')
    list_filter = ('platform', 'genre')
    search_fields = ('title',)

@admin.register(UserGameEntry)
class UserGameEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_game_title', 'status', 'rating')
    list_filter = ('user', 'status')
    search_fields = ('game_catalog__title', 'user__username')

    def get_game_title(self, obj):
        return obj.game_catalog.title
    get_game_title.short_description = 'Jogo'

# --- POKÉMON ---

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = ('pokedex_id', 'name', 'type1', 'type2')
    search_fields = ('name', 'pokedex_id')
    list_filter = ('type1',)

@admin.register(UserPokemon)
class UserPokemonAdmin(admin.ModelAdmin):
    list_display = ('user', 'pokemon', 'is_shiny', 'captured_at')
    list_filter = ('user', 'is_shiny')
    search_fields = ('user__username', 'pokemon__name')

@admin.register(PokemonHallOfFame)
class PokemonHallOfFameAdmin(admin.ModelAdmin):
    list_display = ('user', 'game_name')
    search_fields = ('user__username', 'game_name')

# --- OUTRAS COLEÇÕES ---

@admin.register(Console)
class ConsoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')

@admin.register(BoardGame)
class BoardGameAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'min_players', 'max_players')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')

# --- SISTEMA DE FEEDBACK ---

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'short_message', 'created_at')
    readonly_fields = ('created_at',)
    search_fields = ('user__username', 'message')

    def short_message(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    short_message.short_description = "Mensagem"