from django.db import models
from django.contrib.auth.models import User

class Console(models.Model):
    name = models.CharField(max_length=100, unique=True)
    photo = models.ImageField(upload_to='consoles/', blank=True, null=True, help_text="Foto do console")

    def __str__(self):
        return self.name
    
class Platform(models.Model):
    name = models.CharField(max_length=100, unique=True)
    platform_image = models.ImageField(upload_to='platforms/', blank=True, null=True)

    def __str__(self):
        return self.name

class BoardGame(models.Model):
    name = models.CharField(max_length=200, unique=True)
    cover_image = models.ImageField(upload_to='boardgames/', blank=True, null=True)
    rules = models.TextField(blank=True, help_text="Digite ou cole as regras aqui")

    def __str__(self):
        return self.name

class Pokemon(models.Model):
    pokedex_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    sprite_url = models.URLField(blank=True, null=True)
    type1 = models.CharField(max_length=50)
    type2 = models.CharField(max_length=50, blank=True, null=True)
    
    is_captured = models.BooleanField(default=False)
    game_captured_in = models.CharField(max_length=100, blank=True, null=True, help_text="Ex: Red, Scarlet, etc.")

    def __str__(self):
        return f"#{self.pokedex_id}: {self.name}"

class PokemonHallOfFame(models.Model):
    game_name = models.CharField(max_length=100, help_text="Ex: Pokémon Red (Zerado 1)")
    
    sprite_1 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_2 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_3 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_4 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_5 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_6 = models.ImageField(upload_to='teams/', blank=True, null=True)

    def __str__(self):
        return f"Hall da Fama: {self.game_name}"

class Game(models.Model):
    STATUS_CHOICES = [
        ('ZEREI', 'Zerei'),
        ('JOGUEI', 'Joguei'),
        ('JOGANDO', 'Jogando'),
        ('PAUSADO', 'Pausado'),
    ]
    
    title = models.CharField(max_length=200)
    cover_image = models.ImageField(upload_to='games/', blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True, help_text="Ex: RPG, Luta, etc.")
    platform = models.ForeignKey(Platform, on_delete=models.SET_NULL, null=True, blank=True)
    release_year = models.IntegerField(blank=True, null=True, help_text="Ano de lançamento")
    play_time = models.CharField(max_length=20, blank=True, null=True, help_text="Ex: 5h, 302h (opcional)")
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True, help_text="Nota de 0 a 10 (ex: 8.5)")
    observations = models.TextField(blank=True, null=True, help_text="DLCs, comentários, etc.")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='JOGUEI')
    
    hall_of_fame_entry = models.ForeignKey(
        PokemonHallOfFame, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Se for um jogo Pokémon zerado, linke a equipe aqui."
    )

    def __str__(self):
        return f"{self.title} ({self.platform.name if self.platform else 'N/A'})"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback de {self.user.username} em {self.created_at.strftime('%d/%m/%Y')}"