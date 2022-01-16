from bson.objectid import ObjectId
from django.views import View
from django.http import QueryDict, HttpResponse
from django.http.response import JsonResponse
from pymongo import MongoClient
import certifi
import uuid
from datetime import datetime
import bcrypt

import cloudinary
import cloudinary.uploader
import cloudinary.api

from google.oauth2 import id_token
from google.auth.transport import requests


# Create your views here.

class OAuth2(View):
    
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users

    def post(self, request):

        token = request.POST.get("token")

        try:

            idinfo = id_token.verify_oauth2_token(token, requests.Request(
            ), "212729155817-dc32jv3rj9goboktv71fbbjo4hggsnfa.apps.googleusercontent.com")

            email = idinfo['email']
            
            us = self.users.find_one({"correo": email})

            if (us == None):
                return JsonResponse({"ok": False, "msg": 'No se encuentra a ningún usuario con el correo introducido', 'email': email, 'name': idinfo["name"], 'picture': idinfo["picture"]}, safe=False)

            else:
                return JsonResponse({"ok": True, "usuario": us}, safe=False)

        except ValueError:
            # Invalid token
            return JsonResponse({"ok": False, "msg": "Token inválido"}, safe=False)


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
            return JsonResponse({"ok": False, "msg": 'No se encuentra a ningún usuario con el correo introducido'}, safe=False)

        else:

            if(not bcrypt.checkpw(request.POST.get("password").encode(), us["password"])):
                return JsonResponse({"ok": False, "msg": 'El password introducido no coincide con el del usuario'}, safe=False)

            else:
                us = self.users.find_one({"uuid": us["uuid"]}, {
                                         "_id": 0, "password": 0})
                return JsonResponse({"ok": True, "usuario": us}, safe=False)


class Users(View):

    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        self.valoraciones = db.valoraciones

    def get(self, request):

        # Devuelve todos los datos de un usuario
        if(request.GET.get("localidad") == None and request.GET.get("correo") == None):

            us = self.users.find_one({"uuid": request.GET.get("uuid")}, {
                                     "_id": 0, "password": 0})
            if us == None:

                return JsonResponse({"ok": False, "msg": 'No se encuentra a ningún usuario con el id introducido'}, safe=False)
            else:

                valoracion = request.GET.get("valoracion")
                if valoracion != None and valoracion != 'null':
                    valoracion = int(valoracion)
                    lista = list(self.valoraciones.find(
                        {"receptor": us["uuid"]}, {"_id": 0}))

                    if valoracion == 1:  # Más recientes
                        lista = sorted(lista, key=lambda x: x["fecha"])
                        lista.reverse()
                    elif valoracion == 2:  # Más antiguos
                        lista = sorted(lista, key=lambda x: x["fecha"])
                    elif valoracion == 3:  # Mejor puntuacion
                        lista = sorted(lista, key=lambda x: x["nota"])
                        lista.reverse()
                    elif valoracion == 4:  # Mejor puntuacion
                        lista = sorted(lista, key=lambda x: x["nota"])

                    for v in lista:
                        emisor = self.users.find_one(
                            {"uuid": v["emisor"]}, {"_id": 0})
                        v["nombre"] = emisor["nombre"] + \
                            " " + emisor["apellidos"]
                    return JsonResponse({"ok": True, "usuario": us, "valoraciones": lista}, safe=False)
                return JsonResponse({"ok": True, "usuario": us, "valoraciones": list(self.valoraciones.find({}, {"_id": 0}))}, safe=False)

        # Consulta parametrizada por email
        elif (request.GET.get("correo") != None):
            lista = []
            for u in self.users.find({}, {"_id": 0, "password": 0}):
                if(u["correo"].find(request.GET.get("correo")) >= 0 and request.GET.get("uuid") != u["uuid"]):
                    lista.append(u)
            return JsonResponse({"ok": True, "usuarios": lista}, safe=False)

        # Consulta parametrizada por localidad
        else:
            lista = []
            for u in self.users.find({}, {"_id": 0, "password": 0}):
                if(u["localidad"].find(request.GET.get("localidad")) >= 0 and request.GET.get("uuid") != u["uuid"]):
                    lista.append(u)

            return JsonResponse({"ok": True, "usuarios": lista}, safe=False)

    # Inserta un usuario en la base de datos (Registrarse)
    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False

    def post(self, request):
        receptor = request.GET.get("uuid")

        data = QueryDict(request.body)

        encontrado = False
        contador = 0
        while(not encontrado and contador < len(data)):
            encontrado = self.comprobarCaracteres(
                list(data.values())[contador])
            contador = contador + 1

        newValues = {
            "uuid": str(uuid.uuid1()),
            "emisor": data["emisor"],
            "receptor": receptor,
            "nota": int(data["nota"]),
            "comentario": data["comentario"],
            "fecha": datetime.now()
        }

        self.valoraciones.insert_one(newValues)

        val = self.valoraciones.find_one(
            {"uuid": newValues["uuid"]}, {"_id": 0})
        if val == None:
            return JsonResponse({"ok": False, "msg": "No existe ninguna valoracion con esta id"}, safe=False)
        else:
            return JsonResponse({"ok": True, "valoracion": val})

    # Actualiza los datos del usuario que coincida con el id proporcionado.

    def put(self, request):
        data = QueryDict(request.body)
        filter = {'uuid': data["uuid"]}

        if(self.users.find_one({"uuid": data["uuid"]}, {"_id": 0}) == None):
            return JsonResponse({"ok": False, "msg": 'No se ha encontrado un usuario con el id introducido'}, safe=False)

        vacio, jsonDataVacio = self.paramVacio(data)
        if(not vacio):

            ok, jsonData = self.comprobaciones(data, "put")

            if(ok):

                salt = bcrypt.gensalt()
                hashed = bcrypt.hashpw(data["password"].encode(), salt)

                newvalues = {"$set": {'nombre': data["nombre"], 'apellidos': data["apellidos"], 'password': hashed,
                                      'edad': data["edad"], 'correo': data["correo"], 'telefono': data["telefono"], 'localidad': data["localidad"]}}
                self.users.update_one(filter, newvalues)
                us = self.users.find_one({"uuid": data["uuid"]}, {
                    "_id": 0, "password": 0})
                return JsonResponse({"ok": True, "usuario": us})

            else:
                return jsonData
        else:
            return jsonDataVacio

    # Borra al usuario que coincida con el id proporcionado.
    def delete(self, request):
        data = QueryDict(request.body)
        us = self.users.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if us == None:
            return JsonResponse({"ok": False, "msg": 'No se ha encontrado un usuario con el id introducido'}, safe=False)

        self.users.delete_one(us)
        return JsonResponse({"ok": True})


class Registrarse(View):

    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.users = db.users
        self.valoraciones = db.valoraciones

    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False

    def comprobaciones(self, data, metodo):
        correo = data["correo"]

        us = self.users.find_one({"correo": correo})

        if((correo.endswith("@hotmail.com") or correo.endswith("@hotmail.es") or correo.endswith("@gmail.com") or correo.endswith("@gmail.es") or correo.endswith("@uma.es")) and ((us == None and (metodo == "post" or metodo == "put")) or (metodo == "put" and us["uuid"] == data["uuid"]))):

            encontrado = False
            contador = 0
            while(not encontrado and contador < len(data)):
                encontrado = self.comprobarCaracteres(
                    list(data.values())[contador])
                contador = contador + 1

            if(encontrado):
                return False, JsonResponse({"ok": False, "msg": "No se pueden usar carácteres no válidos"}, safe=False)
            else:
                return True, JsonResponse({"ok": True})

        else:
            if(us == None):
                return False, JsonResponse({"ok": False, "msg": "El email introducido no es válido"})
            else:
                return False, JsonResponse({"ok": False, "msg": "El email introducido ya existe"})

    def paramVacio(self, data):
        condicionNull = False
        for d in data.values():
            if(d is None or d == ""):
                condicionNull = True

        return condicionNull, JsonResponse({"ok:": False, "msg": 'No se pueden introducir campos vacíos'}, safe=False)

    def post(self, request):
        data = request.POST.dict()

        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(data["password"].encode(), salt)

        if(not bcrypt.checkpw(data["confirmarPassword"].encode(), hashed)):
            return JsonResponse({"ok": False, "msg": "Las contraseñas introducidas no coinciden"})
        else:
            vacio, jsonDataVacio = self.paramVacio(data)
            if(not vacio):
                ok = True

                ok, jsonData = self.comprobaciones(data, "post")
                if(ok):

                    img = request.FILES['imagen']
                    if img == None:
                        url = ""
                    else:

                        cloudinary.config(
                            cloud_name="dotshh7i8",
                            api_key="131739146615866",
                            api_secret="M-smYHe4EbW3a3n6e9L7bY-Btgk"
                        )

                        res = cloudinary.uploader.upload(img)

                        url = res["url"]

                    us = {"uuid": str(uuid.uuid1()), "nombre": data["nombre"], "apellidos": data["apellidos"], "password": hashed,
                          "edad": data["edad"], "correo": data["correo"], "telefono": data["telefono"], "localidad": data["localidad"], "imagen": url}

                    self.users.insert_one(us)

                    us = self.users.find_one({"uuid": us["uuid"]}, {
                        "_id": 0, "password": 0})

                    return JsonResponse({"ok": True, "usuario": us, "msg": "El usuario se ha registrado con éxito"})
                else:
                    return jsonData

            else:
                return jsonDataVacio
