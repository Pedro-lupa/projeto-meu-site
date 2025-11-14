from django.db import models
from django.contrib.auth.models import User

class Console(models.Model):
    name = models.CharField(max_length=100, unique=True)
    photo_url = models.URLField(blank=True, null=True, help_text="Link para uma foto do console")

    def __str__(self):
        return self.name

class BoardGame(models.Model):
    name = models.CharField(max_length=200, unique=True)
    cover_image_url = models.URLField(blank=True, null=True)
    rules = models.TextField(blank=True, help_text="Digite ou cole as regras aqui")

    def __str__(self):
        return self.name

class Game(models.Model):
    STATUS_CHOICES = [
        ('ZEREI', 'Zerei'),
        ('JOGUEI', 'Joguei'),
        ('JOGANDO', 'Jogando'),
        ('PAUSADO', 'Pausado'),
    ]
    
    title = models.CharField(max_length=200)
    cover_image_url = models.URLField(blank=True, null=True)
    platform = models.ForeignKey(Console, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='JOGUEI')
    
    is_completed = models.BooleanField(default=False, help_text="Marque se este jogo foi zerado")
    my_review = models.TextField(blank=True, null=True, help_text="Escreva sua análise (só para zerados)")

    def __str__(self):
        return f"{self.title} ({self.platform.name if self.platform else 'N/A'})"

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
    date_completed = models.DateField(auto_now_add=True)
    team_members = models.ManyToManyField(Pokemon)

    def __str__(self):
        return f"Hall da Fama: {self.game_name}"

class Feedback(models.Model):
 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback de {self.user.username} em {self.created_at.strftime('%d/%m/%Y')}"