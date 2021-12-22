from django.urls import path
from .views import Conversacion, MisMensajes

urlpatterns = [
    path('/conversaciones', Conversacion.as_view(), name='conversaciones'),
    path('/redactados', MisMensajes.as_view(), name='redactados'),
]
