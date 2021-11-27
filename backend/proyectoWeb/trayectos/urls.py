from django.urls import path
from .views import Trayectos, TrayectosCreados, TrayectosInscritos, Inscripcion, Desinscripcion
urlpatterns = [
     path('', Trayectos.as_view(), name='user'),
     path('/inscribir', Inscripcion.as_view() , name="inscribir"),
     path('/desinscribir', Desinscripcion.as_view() , name="inscribir"),
     path('/<str:idUsuario>', TrayectosCreados.as_view() , name="trayectosCreados"),
     path('/inscribir/<str:idUsuario>', TrayectosInscritos.as_view() , name="inscribir"),
    
]
