from django.core.management.base import BaseCommand
from api.models import GameCatalog, Platform, UserGameEntry
from django.contrib.auth.models import User
import requests
from django.core.files.base import ContentFile
import time

class Command(BaseCommand):
    help = 'Importa a coleção COMPLETA linha por linha do PDF/Planilha'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('--- IMPORTANDO COLEÇÃO COMPLETA (47 ITENS) ---'))

        # 1. Pega seu usuário
        try:
            user = User.objects.get(username='lupa')
        except User.DoesNotExist:
            user = User.objects.first()
            if not user:
                self.stdout.write(self.style.ERROR("ERRO: Nenhum usuário encontrado."))
                return

        self.stdout.write(f"Usuário: {user.username}")

        # 2. A Lista EXATA (Linha por Linha)
        games_data = [
            # --- NINTENDO SWITCH (7 jogos) ---
            {"title": "Inside", "plat": "Nintendo Switch", "year": 2016, "time": "4h", "score": 8.0},
            {"title": "Luigi's Mansion 3", "plat": "Nintendo Switch", "year": 2019, "time": "20h", "score": 9.5},
            {"title": "Mario Strikers: Battle League", "plat": "Nintendo Switch", "year": 2022, "time": "20h", "score": 7.0},
            {"title": "Pokémon Violet", "plat": "Nintendo Switch", "year": 2022, "time": "320h", "score": 9.5},
            {"title": "Pokémon Violet (The Indigo Disk)", "plat": "Nintendo Switch", "year": 2023, "time": None, "score": 7.5}, # DLC
            {"title": "Pokémon Violet (The Teal Mask)", "plat": "Nintendo Switch", "year": 2023, "time": None, "score": 8.5}, # DLC
            {"title": "Super Mario Bros. Wonder", "plat": "Nintendo Switch", "year": 2023, "time": "9h", "score": 9.0},

            # --- XBOX ONE S (8 jogos) ---
            {"title": "Crash Bandicoot", "plat": "Xbox One", "year": 2017, "time": "7h", "score": 9.0},
            {"title": "Crash Bandicoot 2: Cortex Strikes Back", "plat": "Xbox One", "year": 2017, "time": "5h", "score": 8.5},
            {"title": "Crash Bandicoot Warped", "plat": "Xbox One", "year": 2017, "time": "5h", "score": 9.5},
            {"title": "Crash Team Racing Nitro-Fueled", "plat": "Xbox One", "year": 2019, "time": "10h", "score": 10.0}, # Tempo ajustado
            {"title": "Never Alone", "plat": "Xbox One", "year": 2014, "time": "3h", "score": 7.0},
            {"title": "Injustice 2", "plat": "Xbox One", "year": 2017, "time": "302h", "score": 8.5},
            {"title": "Mortal Kombat 11", "plat": "Xbox One", "year": 2019, "time": "231h", "score": 8.0},
            {"title": "Mortal Kombat 11 (Aftermath)", "plat": "Xbox One", "year": 2020, "time": None, "score": 8.0}, # DLC

            # --- GAME CUBE (3 jogos) ---
            {"title": "Crash Bandicoot: The Wrath of Cortex", "plat": "GameCube", "year": 2001, "time": None, "score": 7.5},
            {"title": "Crash Nitro Kart", "plat": "GameCube", "year": 2003, "time": None, "score": 8.0},
            {"title": "Mario Kart: Double Dash!!", "plat": "GameCube", "year": 2003, "time": None, "score": 6.0},

            # --- GAMEBOY ADVANCE (8 jogos) ---
            {"title": "Crash Bandicoot: The Huge Adventure", "plat": "GBA", "year": 2002, "time": None, "score": 7.5},
            {"title": "Pokémon Ruby Version", "plat": "GBA", "year": 2002, "time": None, "score": 7.5},
            {"title": "Pokémon Sapphire Version", "plat": "GBA", "year": 2002, "time": None, "score": 7.5},
            {"title": "Crash Bandicoot 2: N-Tranced", "plat": "GBA", "year": 2003, "time": None, "score": 7.5},
            {"title": "Crash Nitro Kart (GBA)", "plat": "GBA", "year": 2003, "time": None, "score": 7.0}, # Específico GBA
            {"title": "Dragon Ball: Advanced Adventure", "plat": "GBA", "year": 2004, "time": None, "score": 8.0},
            {"title": "Pokémon Emerald Version", "plat": "GBA", "year": 2004, "time": None, "score": 10.0},
            {"title": "Pokémon FireRed Version", "plat": "GBA", "year": 2004, "time": None, "score": 8.0},

            # --- NES (2 jogos) ---
            {"title": "Super Mario Bros.", "plat": "NES", "year": 1985, "time": "32m", "score": 6.0},
            {"title": "Super Mario Bros. 3", "plat": "NES", "year": 1988, "time": "7h", "score": 9.0},

            # --- NINTENDO 3DS (1 jogo) ---
            {"title": "Pokémon X", "plat": "Nintendo 3DS", "year": 2013, "time": None, "score": 9.5},

            # --- NINTENDO DS (4 jogos) ---
            {"title": "Mario Kart DS", "plat": "Nintendo DS", "year": 2005, "time": None, "score": 7.5},
            {"title": "Pokémon Platinum Version", "plat": "Nintendo DS", "year": 2008, "time": None, "score": 8.0},
            {"title": "Pokémon Black Version", "plat": "Nintendo DS", "year": 2010, "time": None, "score": 8.5},
            {"title": "Pokémon White Version 2", "plat": "Nintendo DS", "year": 2012, "time": None, "score": 9.0},

            # --- NINTENDO WII (2 jogos) ---
            {"title": "Mario Kart Wii", "plat": "Wii", "year": 2008, "time": None, "score": 8.5},
            {"title": "Mario Party 9", "plat": "Wii", "year": 2012, "time": None, "score": 7.0},

            # --- PC (5 jogos) ---
            {"title": "Cave Chaos", "plat": "PC", "year": 2007, "time": None, "score": 7.0},
            {"title": "Bad Ice-Cream", "plat": "PC", "year": 2010, "time": None, "score": 7.0},
            {"title": "Bad Ice-Cream 2", "plat": "PC", "year": 2012, "time": None, "score": 7.0},
            {"title": "Cave Chaos 2", "plat": "PC", "year": 2012, "time": None, "score": 7.0},
            {"title": "Bad Ice-Cream 3", "plat": "PC", "year": 2013, "time": None, "score": 7.0},

            # --- PLAYSTATION 1 (4 jogos) ---
            {"title": "Crash Bandicoot", "plat": "PlayStation", "year": 1996, "time": None, "score": 9.0},
            {"title": "Crash Bandicoot 2: Cortex Strikes Back", "plat": "PlayStation", "year": 1997, "time": None, "score": 8.5},
            {"title": "Crash Bandicoot: Warped", "plat": "PlayStation", "year": 1998, "time": None, "score": 9.5},
            {"title": "Crash Team Racing", "plat": "PlayStation", "year": 1999, "time": None, "score": 10.0},

            # --- SNES (1 jogo) ---
            {"title": "Super Mario World", "plat": "SNES", "year": 1991, "time": "6h", "score": 9.5},

            # --- XBOX 360 (2 jogos) ---
            {"title": "Castle Crashers", "plat": "Xbox 360", "year": 2008, "time": "20h", "score": 7.5},
            {"title": "Mortal Kombat 9", "plat": "Xbox 360", "year": 2011, "time": None, "score": 8.5},
        ]

        count = 0
        for item in games_data:
            title = item['title']
            plat_name = item['plat']
            
            self.stdout.write(f"[{count+1}/47] Processando: {title} ({plat_name})...")

            # 1. Plataforma
            platform_obj, _ = Platform.objects.get_or_create(name=plat_name)

            # 2. Jogo no Catálogo (Usamos Título + Plataforma pra diferenciar o Crash de PS1 do de Xbox)
            # Assim garante que Crash Bandicoot (PS1) e Crash Bandicoot (Xbox One) sejam jogos diferentes
            game, created = GameCatalog.objects.get_or_create(
                title=title,
                platform=platform_obj, # IMPORTANTE: Vincula à plataforma específica
                defaults={
                    'genre': 'Game',
                    'release_year': item['year']
                }
            )

            # 3. Tenta baixar capa da Steam (Só para plataformas compatíveis)
            # Ignora Nintendo para não perder tempo, pois Steam não tem Mario/Zelda
            if (created or not game.cover_image) and plat_name in ['PC', 'Xbox One', 'Xbox 360', 'PlayStation']:
                try:
                    # Removemos sufixos tipo (Aftermath) pra busca da Steam funcionar melhor
                    search_title = title.split('(')[0].strip()
                    
                    search_url = "https://store.steampowered.com/api/storesearch/"
                    params = {'term': search_title, 'l': 'brazilian', 'cc': 'BR'}
                    r = requests.get(search_url, params=params, timeout=2)
                    d = r.json()
                    if d['total'] > 0:
                        steam_id = d['items'][0]['id']
                        img_url = f"https://cdn.akamai.steamstatic.com/steam/apps/{steam_id}/header.jpg"
                        img_resp = requests.get(img_url)
                        if img_resp.status_code == 200:
                            game.cover_image.save(f"{steam_id}.jpg", ContentFile(img_resp.content), save=True)
                except:
                    pass

            # 4. Salva na SUA coleção (UserGameEntry)
            entry, entry_created = UserGameEntry.objects.update_or_create(
                user=user,
                game_catalog=game,
                defaults={
                    'status': 'ZEREI' if (item['score'] and item['score'] >= 7) else 'JOGUEI',
                    'rating': item['score'],
                    'play_time': item['time'] if item['time'] else ""
                }
            )
            count += 1

        self.stdout.write(self.style.SUCCESS(f'--- FINALIZADO! {count} JOGOS IMPORTADOS ---'))