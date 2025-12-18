from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# --- FUNÇÃO AUXILIAR PARA ORGANIZAR ARQUIVOS ---
def avatar_path(instance, filename):
    # Salva em: media/avatars/user_1/nomedafoto.jpg
    return f"avatars/user_{instance.user.id}/{filename}"

# --- MODELOS DE SISTEMA (PLATAFORMAS E JOGOS) ---

class Platform(models.Model):
    name = models.CharField(max_length=100, unique=True)
    platform_image = models.ImageField(upload_to='platforms/', blank=True, null=True)

    def __str__(self):
        return self.name

class GameCatalog(models.Model):
    title = models.CharField(max_length=200)
    api_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    platform = models.ForeignKey(Platform, on_delete=models.SET_NULL, null=True, blank=True)
    cover_image = models.ImageField(upload_to='games_cover/', blank=True, null=True)
    cover_url = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    release_year = models.IntegerField(blank=True, null=True)
    # Quem cadastrou esse jogo no sistema global (pode ser nulo se foi importado)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='catalog_contributions')

    def __str__(self):
        return f"{self.title}"

# --- MODELOS DE POKÉMON ---

class Pokemon(models.Model):
    pokedex_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    sprite_url = models.URLField(blank=True, null=True)
    shiny_sprite_url = models.URLField(blank=True, null=True)
    type1 = models.CharField(max_length=50)
    type2 = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class PokemonHallOfFame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_name = models.CharField(max_length=100)
    sprite_1 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_2 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_3 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_4 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_5 = models.ImageField(upload_to='teams/', blank=True, null=True)
    sprite_6 = models.ImageField(upload_to='teams/', blank=True, null=True)

    def __str__(self):
        return f"Hall da Fama: {self.game_name} ({self.user.username})"

class UserPokemon(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pokedex')
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    is_shiny = models.BooleanField(default=False)
    # Para saber se já capturou a versão normal ou shiny
    captured_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'pokemon', 'is_shiny')

# --- MODELOS DE USUÁRIO (COLEÇÃO PESSOAL) ---

class UserGameEntry(models.Model):
    STATUS_CHOICES = [
        ('ZEREI', 'Zerei'),
        ('JOGUEI', 'Joguei'),
        ('JOGANDO', 'Jogando'),
        ('PAUSADO', 'Pausado'),
        ('QUERO', 'Quero Jogar'),
        ('PLATINEI', 'Platinei'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_games')
    game_catalog = models.ForeignKey(GameCatalog, on_delete=models.CASCADE, related_name='played_by_users')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='JOGUEI')
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True) # Nota 0.0 a 10.0
    play_time = models.CharField(max_length=20, blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    hall_of_fame = models.ForeignKey(PokemonHallOfFame, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game_catalog')

    def __str__(self):
        return f"{self.user.username} jogou {self.game_catalog.title}"

class Console(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='consoles/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class BoardGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    cover_image = models.ImageField(upload_to='boardgames/', blank=True, null=True)
    rules = models.TextField(blank=True)
    description = models.TextField(blank=True, null=True)
    min_players = models.IntegerField(blank=True, null=True)
    max_players = models.IntegerField(blank=True, null=True)
    play_time = models.CharField(max_length=50, blank=True, null=True)
    age = models.CharField(max_length=20, blank=True, null=True)
    publisher = models.CharField(max_length=100, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback de {self.user.username}"

# --- PERFIL SOCIAL DO USUÁRIO ---

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_public = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to=avatar_path, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    favorite_game = models.CharField(max_length=100, blank=True, null=True)
    profile_views = models.IntegerField(default=0)
    
    def __str__(self):
        return self.user.username

# --- AUTOMATIZAÇÃO (SIGNALS) ---
# Isso garante que sempre que um User for criado (no cadastro),
# um UserProfile vazio é criado automaticamente para ele.

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()