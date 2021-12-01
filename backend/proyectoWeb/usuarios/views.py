from django.views import View
from django.http import QueryDict
from django.http.response import JsonResponse
from pymongo import MongoClient
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

    def get(self, request):

        # Devuelve todos los datos de un usuario
        if(request.GET.get("localidad") == None and request.GET.get("correo") == None):

            us = self.users.find_one({"uuid": request.GET.get("uuid")}, {
                                     "_id": 0, "password": 0})
            if us == None:

                return JsonResponse({"ok": False, "msg": 'No se encuentra a ningún usuario con el id introducido'}, safe=False)

            return JsonResponse({"ok": True, "usuario": us}, safe=False)

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

    # Inserta un usuario en la base de datos (Registrarse)

    def post(self, request):

        data = QueryDict(request.body)

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

                    us = {"uuid": str(uuid.uuid1()), "nombre": data["nombre"], "apellidos": data["apellidos"], "password": hashed,
                          "edad": data["edad"], "correo": data["correo"], "telefono": data["telefono"], "localidad": data["localidad"]}

                    self.users.insert_one(us)

                    us = self.users.find_one({"uuid": us["uuid"]}, {
                        "_id": 0, "password": 0})

                    return JsonResponse({"ok": True, "usuario": us, "msg": "El usuario se ha registrado con éxito"})
                else:
                    return jsonData

            else:
                return jsonDataVacio

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
