from django.urls import path
from .views import UsersList, Login
urlpatterns = [
    path('', UsersList.as_view(), name='user'),
    path('/login', Login.as_view(), name="login"),
]
