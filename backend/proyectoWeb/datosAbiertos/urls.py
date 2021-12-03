from django.urls import path
from .views import DatosCoches, DatosGasolineras
urlpatterns = [
    path('/coches', DatosCoches.as_view(), name='gasolineras'),
    path('/gasolineras', DatosGasolineras.as_view(), name='coches'),
]
