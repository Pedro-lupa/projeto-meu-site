from django.contrib import admin
from .models import Console, BoardGame, Game, Pokemon, PokemonHallOfFame, Feedback

@admin.register(Console)
class ConsoleAdmin(admin.ModelAdmin):
    list_display = ('name',) 

@admin.register(BoardGame)
class BoardGameAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',) 

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'status', 'is_completed')
    list_filter = ('status', 'platform', 'is_completed')
    search_fields = ('title',)

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = ('pokedex_id', 'name', 'is_captured', 'game_captured_in')
    list_filter = ('is_captured', 'type1')
    search_fields = ('name', 'pokedex_id')

@admin.register(PokemonHallOfFame)
class PokemonHallOfFameAdmin(admin.ModelAdmin):
    list_display = ('game_name', 'date_completed')
    filter_horizontal = ('team_members',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('user', 'message', 'created_at')