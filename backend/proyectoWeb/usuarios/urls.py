from django.urls import path
from .views import Users, Login, Registrarse
urlpatterns = [
    path('', Users.as_view(), name='user'),
    path('/login', Login.as_view(), name="login"),
    path('/registrarse', Registrarse.as_view(), name="registrarse"),
]
