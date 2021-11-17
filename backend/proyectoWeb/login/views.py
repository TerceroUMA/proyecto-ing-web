from django.views import View
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid

# Create your views here.


class UsersList(View):
    # Devuelve todos los datos de un usuario (Iniciar Sesión)

    def __init__(self):
        client = MongoClient(
        'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        
    
   

    def get(self, request):
        # False indica que devolveremos un array de json y no un unico json
        # return JsonResponse(['a', 'b', 'c'], safe=False)

        us = self.users.find_one({"email": request.GET.get(
            "email"), "password": request.GET.get("password")}, {"_id": 0, "password": 0})
        return JsonResponse(us, safe=False)

    # Inserta un usuario en la base de datos (Registrarse)

    def post(self, request):

        us = {"uuid": uuid.uuid1(),"nombre": "patata2", "apellidos": "patata", "password": "v", "edad": 1,
              "email": "patata@gmail.com", "telefono": "patata", "localidad": "patata"}

        self.users.insert_one(us)
        
        return JsonResponse({"ok": "true", "usuario":us})

    # Actualiza los datos del usuario que coincida con el id proporcionado.
    def put(self, request, email, nombre, apellidos, password, edad, ):
        
        filter = {'email' : request.PUT.get("email")}
        newvalues = {"$set": {'nombre': request.PUT.get("nombre"), 'apellidos': request.PUT.get("apellidos"), 'password': request.PUT.get("password"), 'edad': request.PUT.get("edad"), 'email': request.PUT.get("email"), 'telefono': request.PUT.get("telefono"), 'localidad': request.PUT.get("localidad")}}
        self.users.update_one(filter, newvalues)
        return JsonResponse({"ok": "true"})

    # Borra al usuario que coincida con el id proporcionado.
    def delete(self, request):
        us = {"email": "patata@gmail.com", "password": "v"}
        self.users.delete_one(us)
        return JsonResponse({"ok": "true"})
