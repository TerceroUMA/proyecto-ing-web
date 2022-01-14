from django.urls import path
from .views import Users, Login, Registrarse, OAuth2
urlpatterns = [
    path('', Users.as_view(), name='user'),
    path('/login', Login.as_view(), name="login"),
    path('/registrarse', Registrarse.as_view(), name="registrarse"),
    path('/oauth2', OAuth2.as_view(), name="oauth2"),
]
