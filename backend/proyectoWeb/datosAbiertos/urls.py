from django.urls import path
from .views import Datos
urlpatterns = [
    path('', Datos.as_view(), name='datosAbiertos'),
]
