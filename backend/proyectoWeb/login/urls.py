from django.urls import path
from .views import UsersList
urlpatterns = [
    path('users/', UsersList.as_view(), name='user'),
]
