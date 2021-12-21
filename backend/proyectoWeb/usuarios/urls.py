from django.urls import path
from .views import Users, Login, Valoracion
urlpatterns = [
    path('', Users.as_view(), name='user'),
    path('/login', Login.as_view(), name="login"),
    path('/valoracion', Valoracion.as_view(), name="valoracion"),
]
