from django.views import View
from django.http import QueryDict
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid
import bcrypt


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
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese correo'}, safe=False)

        else:
            

            if(not bcrypt.checkpw(request.POST.get("password").encode(),us["password"])):
                return JsonResponse({"ok": "false", "msg": 'El password introducido no coincide con el del usuario'}, safe=False)

            else:
                us = self.users.find_one({"uuid": us["uuid"]}, {"_id": 0, "password": 0})
                return JsonResponse({"ok": "true", "usuario": us}, safe=False)


class Users(View):

    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users

    def get(self, request):
        # Devuelve todos los datos de un usuario

        us = self.users.find_one({"uuid": request.GET.get("uuid")}, {"_id": 0, "password": 0})
        if us == None:

            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe=False)

        return JsonResponse({"ok": "true", "usuario": us}, safe=False)

    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False
            

    def comprobaciones(self, data, metodo):
        correo = data["correo"]
        
        us = self.users.find_one({"correo": correo})
        
        if((correo.endswith("@hotmail.com") or correo.endswith("@hotmail.es") or correo.endswith("@gmail.com")  or correo.endswith("@gmail.es") or correo.endswith("@uma.es")) and ((us == None and (metodo == "post" or metodo == "put")) or (metodo == "put" and us["uuid"] == data["uuid"]))):

            encontrado = False
            contador = 0
            while(not encontrado and contador < len(data)):
                encontrado = self.comprobarCaracteres(list(data.values())[contador])
                contador = contador + 1
                    
            if(encontrado):
                return False,JsonResponse({"ok": "false", "msg": "No se pueden usar carácteres no válidos"}, safe=False)
            else:
                return True,JsonResponse({"ok": "true"})

        else:
            if(us == None):
                return False,JsonResponse({"ok": "false", "msg": "El email introducido no es válido"})
            else:
                return False,JsonResponse({"ok": "false", "msg": "El email introducido ya existe"})

    # Inserta un usuario en la base de datos (Registrarse)

    def post(self, request):

        data = QueryDict(request.body)
        
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(data["password"].encode(), salt)

        
        if(not bcrypt.checkpw(data["confirmarPassword"].encode(), hashed)):
            return JsonResponse({"ok": "false", "msg": "Las contraseñas no coinciden"})
        else:
        
            ok = True

            ok, jsonData = self.comprobaciones(data, "post")
            if(ok):

                us = {"uuid": str(uuid.uuid1()), "nombre": data["nombre"], "apellidos": data["apellidos"], "password": hashed, "edad": data["edad"], "correo": data["correo"], "telefono": data["telefono"], "localidad": data["localidad"]}

                self.users.insert_one(us)

                us = self.users.find_one({"uuid": us["uuid"]}, {"_id": 0, "password": 0})

                return JsonResponse({"ok": "true", "usuario": us})
            else:
                return jsonData

    # Actualiza los datos del usuario que coincida con el id proporcionado.
    def put(self, request):
        data = QueryDict(request.body)
        filter = {'uuid': data["uuid"]}

        if(self.users.find_one({"uuid": data["uuid"]}, {"_id": 0}) == None):
            return JsonResponse({"ok": "false", "msg": 'No se ha encontrado un usuario con ese id'}, safe=False) 
        
        ok, jsonData = self.comprobaciones(data, "put")
        
        if(ok):
            
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(data["password"].encode(), salt)

            newvalues = {"$set": {'nombre': data["nombre"], 'apellidos': data["apellidos"], 'password': hashed, 'edad': data["edad"], 'correo': data["correo"], 'telefono': data["telefono"], 'localidad': data["localidad"]}}
            self.users.update_one(filter, newvalues)
            return JsonResponse({"ok": "true"})
        else:
            return jsonData

    # Borra al usuario que coincida con el id proporcionado.
    def delete(self, request):
        data = QueryDict(request.body)
        us = self.users.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if us == None:
            return JsonResponse({"ok": "false", "msg": 'No se ha encontrado un usuario con ese id'}, safe=False)

        self.users.delete_one(us)
        return JsonResponse({"ok": "true"})
