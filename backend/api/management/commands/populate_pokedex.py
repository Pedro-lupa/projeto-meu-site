import requests
from django.core.management.base import BaseCommand
from api.models import Pokemon

class Command(BaseCommand):
    help = 'Popula o banco de dados com todos os Pokémons da PokéAPI'

    def handle(self, *args, **kwargs):
        self.stdout.write("Iniciando download da Pokédex...")
        
        url = "https://pokeapi.co/api/v2/pokemon?limit=1025"
        response = requests.get(url)
        data = response.json()

        for entry in data['results']:

            r = requests.get(entry['url'])
            p_data = r.json()
            
            dex_id = p_data['id']
            name = p_data['name'].capitalize()
            
            types = p_data['types']
            t1 = types[0]['type']['name']
            t2 = types[1]['type']['name'] if len(types) > 1 else None
            
            sprite = p_data['sprites']['front_default']
            shiny = p_data['sprites']['front_shiny']

            obj, created = Pokemon.objects.get_or_create(
                pokedex_id=dex_id,
                defaults={
                    'name': name,
                    'sprite_url': sprite,
                    'shiny_sprite_url': shiny,
                    'type1': t1,
                    'type2': t2,
                }
            )
            
            if created:
                self.stdout.write(f"Criado: #{dex_id} {name}")
            else:
                self.stdout.write(f"Já existe: #{dex_id} {name}")

        self.stdout.write(self.style.SUCCESS('Pokédex Completa Atualizada!'))