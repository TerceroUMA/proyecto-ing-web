from django.urls import path
from .views import DatosCoches, DatosGasolineras
urlpatterns = [
    path('/coches', DatosCoches.as_view(), name='datosAbiertos'),
    path('/gasolineras', DatosGasolineras.as_view(), name='datosAbiertos'),
]
