from django.views import View
from django.http.response import JsonResponse, HttpResponse
from pymongo import MongoClient
from django.core import serializers

# Create your views here.


class UsersList(View):
    # Devuelve todos los datos de un usuario.
    def get(self, request):
        
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/')

        db = client['IngWeb']

        trayectos = db.trayectos
        usuarios = db.users
        conversaciones = db.conversaciones
        mensajes = db.mensajes
        valoraciones = db.valoraciones
        
        print(trayectos)




    # Registra a un nuevo usuario.
    def post(self, request):
        dict = {
            "name": "John",
            "age": 30,
            "city": "New York"
        }
        return JsonResponse(dict, safe=False)

    # Actualiza los datos del usuario que coincida con el id proporcionado.
    def put(self, request):
        
        return JsonResponse()

    # Borra al usuario que coincida con el id proporcionado.
    def delete(self, request):
        return JsonResponse()