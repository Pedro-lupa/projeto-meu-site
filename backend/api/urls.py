from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsoleViewSet

router = DefaultRouter()
router.register(r'consoles', ConsoleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
