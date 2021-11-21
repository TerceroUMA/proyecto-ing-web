from django.views import View
from django.http import QueryDict
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
        
    
   

    def post(self, request):
        
        # Inicio de Sesión

        us = self.users.find_one({"correo": request.POST.get("correo")})
        
        if (us == None):
            return JsonResponse({"ok": "false", "msg":'No se encuentra a ningún usuario con ese correo'}, safe=False)
            
        else:
        
            if(us["password"] != request.POST.get("password")):
                return JsonResponse({"ok": "false", "msg":'El password introducido no coincide con el del usuario'}, safe=False)
            
            else:
                us = self.users.find_one({"uuid": us["uuid"]}, {"_id": 0})
                return JsonResponse({"ok": "true", "usuario":us}, safe=False)
        
        
        


class Users(View):
    

    def __init__(self):
        client = MongoClient(
        'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        
    
   

    def get(self, request):
        # Devuelve todos los datos de un usuario 

            us = self.users.find_one({"uuid": request.GET.get("uuid")}, {"_id": 0})
            if us == None:
                
                return JsonResponse({"ok": "false", "msg":'No se encuentra a ningún usuario con ese id'}, safe=False)
            
            return JsonResponse({"ok": "true", "usuario":us}, safe=False)
        
        
            
            
            

    # Inserta un usuario en la base de datos (Registrarse)

    def post(self, request):

        us = {"uuid": str(uuid.uuid1()),"nombre": request.POST.get("nombre"), "apellidos": request.POST.get("apellidos"), "password": request.POST.get("password"), "edad": request.POST.get("edad"),
              "correo": request.POST.get("correo"), "telefono": request.POST.get("telefono"), "localidad": request.POST.get("localidad")}

        self.users.insert_one(us)
        
        us = self.users.find_one({"uuid": us["uuid"]}, {"_id": 0})
        
        return JsonResponse({"ok": "true", "usuario":us})

    # Actualiza los datos del usuario que coincida con el id proporcionado.
    def put(self, request):
        print(request.PUT.get("correo"))
        filter = {'email' : request.PUT.get("email")}
        newvalues = {"$set": {'nombre': request.PUT.get("nombre"), 'apellidos': request.PUT.get("apellidos"), 'password': request.PUT.get("password"), 'edad': request.PUT.get("edad"), 'email': request.PUT.get("email"), 'telefono': request.PUT.get("telefono"), 'localidad': request.PUT.get("localidad")}}
        self.users.update_one(filter, newvalues)
        return JsonResponse({"ok": "true"})

    # Borra al usuario que coincida con el id proporcionado.
    def delete(self, request):
        data = QueryDict(request.body)
        us = self.users.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if us == None:
            return JsonResponse({"ok": "false", "msg":'No se ha encontrado un usuario con ese id'}, safe=False)
            
        self.users.delete_one(us)
        return JsonResponse({"ok": "true"})
        
