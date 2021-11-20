from django.views import View
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid

# Create your views here.

class Login(View):
    
    def __init__(self):
        client = MongoClient(
        'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        
    
   

    def get(self, request):
        
        # Inicio de Sesión

        us = self.users.find_one({"correo": request.GET.get("correo")})
        
        if (us == None):
            return JsonResponse({"ok": "false", "msg":'No se encuentra a ningún usuario con ese correo'}, safe=False)
            
        else:
        
            if(us["password"] != request.GET.get("password")):
                return JsonResponse({"ok": "false", "msg":'El password introducido no coincide con el del usuario'}, safe=False)
            
            else:
                return JsonResponse({"ok": "true", "usuario":us}, safe=False)
        
        
        


class Users(View):
    

    def __init__(self):
        client = MongoClient(
        'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        
    
   

    def get(self, request):
        # Devuelve todos los datos de un usuario 

        try:
            us = self.users.find_one({"uuid": request.GET.get("uuid")})
            return JsonResponse({"ok": "true", "usuario":us}, safe=False)
        
        except:
            return JsonResponse({"ok": "false", "msg":'No se encuentra a ningún usuario con ese id'}, safe=False)
            
            

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
        
        try:
            us = {"uuid": request.body.get["uuid"]}
            
            self.users.delete_one(us)
            return JsonResponse({"ok": "true"})
        
        except:
                return JsonResponse({"ok": "false", "msg":'No se ha encontrado un usuario con ese id'}, safe=False)
