from django.urls import path
from .views import Conversacion

urlpatterns = [
    path('', Conversacion.as_view(), name='conversaciones'),
]
