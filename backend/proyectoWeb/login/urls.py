from django.urls import path
from .views import Users, Login
urlpatterns = [
    path('', Users.as_view(), name='user'),
    path('login', Login.as_view(), name="login"),
]
