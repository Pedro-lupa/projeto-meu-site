from django.shortcuts import render
from rest_framework import viewsets
from .models import Console
from .serializers import ConsoleSerializer

class ConsoleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Esta viewset fornece automaticamente ações `list` (listar) e `retrieve` (detalhar).
    """
    queryset = Console.objects.all()
    serializer_class = ConsoleSerializer