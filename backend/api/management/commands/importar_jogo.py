import requests
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from api.models import BoardGame
import time

class Command(BaseCommand):
    help = 'Importa um jogo do BGG com tratamento especial para símbolos (&)'

    def add_arguments(self, parser):
        parser.add_argument('nome_jogo', type=str, help='Nome do jogo para buscar')
        parser.add_argument('--user', type=str, default='pedrinho.jpln@gmail.com', help='Email do dono do jogo')

    def get_value(self, element, tag):
        found = element.find(tag)
        return found.get('value') if found is not None else None

    def get_text(self, element, tag):
        found = element.find(tag)
        return found.text if found is not None else None

    def handle(self, *args, **options):
        nome_busca = options['nome_jogo']
        email_usuario = options['user']

        # 1. Identidade (User-Agent) para não ser bloqueado
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/xml'
        }

        try:
            user = User.objects.get(email=email_usuario)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"❌ Usuário {email_usuario} não encontrado!"))
            return

        self.stdout.write(f"🔍 Buscando '{nome_busca}' no BGG...")

        # 2. Busca o ID (USANDO PARAMS para corrigir o '&' automaticamente)
        search_url = "https://boardgamegeek.com/xmlapi2/search"
        params_busca = {'query': nome_busca, 'type': 'boardgame'}

        try:
            response = requests.get(search_url, params=params_busca, headers=headers)
            
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f"❌ Erro do BGG (Busca): {response.status_code}"))
                self.stdout.write(f"Detalhe: {response.text[:100]}") # Mostra o motivo do erro
                return

            root = ET.fromstring(response.content)
            item = root.find('item')
            
            if item is None:
                self.stdout.write(self.style.ERROR('❌ Jogo não encontrado.'))
                return
            
            bgg_id = item.get('id')
            nome_oficial = self.get_value(item, 'name')
            self.stdout.write(f"🎲 Encontrado: {nome_oficial} (ID: {bgg_id})")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erro técnico na busca: {e}"))
            return

        # Pausa para não irritar o servidor
        time.sleep(1)

        # 3. Pega os detalhes
        thing_url = "https://boardgamegeek.com/xmlapi2/thing"
        params_detalhes = {'id': bgg_id}

        try:
            response = requests.get(thing_url, params=params_detalhes, headers=headers)
            
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f"❌ Erro do BGG (Detalhes): {response.status_code}"))
                return

            root = ET.fromstring(response.content)
            item = root.find('item')

            # Extração dos dados
            descricao = self.get_text(item, 'description')
            if descricao:
                descricao = descricao.replace('<br/>', '\n').replace('&quot;', '"').replace('&#10;', '\n')

            imagem_url = self.get_text(item, 'image')
            min_players = self.get_value(item, 'minplayers')
            max_players = self.get_value(item, 'maxplayers')
            play_time = self.get_value(item, 'playingtime')
            min_age = self.get_value(item, 'minage')
            year = self.get_value(item, 'yearpublished')
            
            publisher = "Desconhecido"
            for link in item.findall("link"):
                if link.get('type') == 'boardgamepublisher':
                    publisher = link.get('value')
                    break

            # 4. Salva no Banco
            board_game, created = BoardGame.objects.get_or_create(
                user=user,
                name=nome_oficial,
                defaults={
                    'description': descricao,
                    'min_players': int(min_players) if min_players else 1,
                    'max_players': int(max_players) if max_players else 4,
                    'play_time': f"{play_time} min" if play_time else None,
                    'age': f"{min_age}+" if min_age else None,
                    'publisher': publisher,
                    'year': int(year) if year else None,
                }
            )

            # Baixa Capa
            if (created or not board_game.cover_image) and imagem_url:
                self.stdout.write("⬇️ Baixando capa...")
                img_res = requests.get(imagem_url, headers=headers)
                if img_res.status_code == 200:
                    filename = f"bgg_{bgg_id}.jpg"
                    board_game.cover_image.save(filename, ContentFile(img_res.content), save=True)

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Sucesso! '{board_game.name}' foi salvo."))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ '{board_game.name}' já existia na sua lista."))

        except Exception as e:
             self.stdout.write(self.style.ERROR(f"Erro ao salvar: {e}"))