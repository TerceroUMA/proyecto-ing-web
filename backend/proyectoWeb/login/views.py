from django.views import View
from django.http.response import JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi

# Create your views here.
class UsersList(View):
    # Devuelve todos los datos de un usuario.
    def get(self, request):
        # False indica que devolveremos un array de json y no un unico json
        #return JsonResponse(['a', 'b', 'c'], safe=False)



        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        usuarios = db.users
        users = list(usuarios.find({}, {"_id": 0}))
        return JsonResponse(users, safe=False)
        


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