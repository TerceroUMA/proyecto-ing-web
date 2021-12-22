from datetime import datetime
from django.views import View
from django.http import QueryDict
from django.http.response import JsonResponse
from pymongo import MongoClient
import certifi
import uuid

# Create your views here.


class Conversacion(View):

    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.conversaciones = db.conversaciones
        self.usuarios = db.users

    def get(self, request):
        uuid = request.GET.get("uuid")

        if(uuid == None):
            data = QueryDict(request.body)
            usID = request.GET.get("idUsuario")
            usuario = self.usuarios.find_one({"uuid": usID}, {"_id": 0})
            
            contador = 0
            encontrado = False

            while(not encontrado and contador < len(data)):
                encontrado = self.comprobarCaracteres(
                    list(data.values())[contador])

                contador = contador + 1

            if(encontrado):
                return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

            lista = []
            visto = request.GET.get("visto")
            fecha = request.GET.get("fecha")
            correo = request.GET.get("correo")

            if(visto == None and fecha == None and correo == None):
                lista = list(self.conversaciones.find(
                    {"receptor": usuario["correo"]}, {"_id": 0}))

                return JsonResponse({"ok": True, "conversaciones": lista})
            else:

                if (visto != None):
                    lista = lista + \
                        list(self.conversaciones.find(
                            {"visto": 0}, {"_id": 0}))
                if (fecha != None):
                    lista = lista + \
                        list(self.conversaciones.find(
                            {"fecha": data["fecha"]}, {"_id": 0}))
                if (correo != None):
                    lista = lista + \
                        list(self.conversaciones.find(
                            {"emisor": correo}, {"_id": 0}))
                return JsonResponse({"ok": True, "conversaciones": lista})
        else:
            conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})
            if(conv == None):
                return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
            else:
                return JsonResponse({"ok": True, "conversacion": conv})

    def delete(self, request):
        uuid = request.GET.get("uuid")
        conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
        else:
            return JsonResponse({"ok": True, "msg": "Conversacion eliminada"}, safe=False)

    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False

    def post(self, request):
        data = QueryDict(request.body)
        contador = 0
        encontrado = False

        while(not encontrado and contador < len(data)):
            encontrado = self.comprobarCaracteres(
                list(data.values())[contador])

            contador = contador + 1

        if(encontrado):
            return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

        if(self.usuarios.find_one({"correo": data["receptor"]}, {"_id": 0}) == None):
            return False, JsonResponse({"ok": False, "msg": "No existe este destinatario"}, safe=False)
            
        idUsuario = request.GET.get("idUsuario")
        emisor = self.usuarios.find_one({"uuid": idUsuario}, {"_id": 0})
        newValues = {
            "uuid": str(uuid.uuid1()),
            "receptor": data["receptor"],
            "emisor": emisor["correo"],
            "asunto": data["asunto"],
            "texto": data["texto"],
            "fecha": datetime.now(),
            "visto": 0
        }

        self.conversaciones.insert_one(newValues)
        conv = self.conversaciones.find_one(
            {"uuid": newValues["uuid"]}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
        else:
            return JsonResponse({"ok": True, "conversacion": conv}, safe=False)

    def put(self, request):
        uuid = request.GET.get("uuid")

        conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)

        self.conversaciones.update_one({"uuid": uuid}, {"$set": {"visto": 1}})

        conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
        else:
            return JsonResponse({"ok": True, "conversacion": conv})


class MisMensajes(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.conversaciones = db.conversaciones
        self.usuarios = db.users

    def get(self, request):
        uuid = request.GET.get("uuid")

        if(uuid == None):
            data = QueryDict(request.body)
            us = {'uuid': data["usuario"]}
            contador = 0
            encontrado = False

            while(not encontrado and contador < len(data)):
                encontrado = self.comprobarCaracteres(
                    list(data.values())[contador])

                contador = contador + 1

            if(encontrado):
                return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

            lista = []
            if(data["visto"] == None and data["fecha"] == None and data["correo"] == None):
                lista = list(self.conversaciones.find(
                    {"emisor": us["correo"]}, {"_id": 0}))

                return JsonResponse({"ok": True, "conversaciones": lista})
            else:
                if (data["fecha"] != None):
                    lista = lista + \
                        list(self.conversaciones.find(
                            {"fecha": data["fecha"]}, {"_id": 0}))
                if (data["correo"] != None):
                    lista = lista + \
                        list(self.conversaciones.find(
                            {"receptor": data["correo"]}, {"_id": 0}))
                return JsonResponse({"ok": True, "conversaciones": lista})
        else:
            conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})
            if(conv == None):
                return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
            else:
                return JsonResponse({"ok": True, "conversacion": conv})

    def post(self, request):
        uuid = request.GET.get("uuid")

        conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)

        data = QueryDict(request.body)
        contador = 0
        encontrado = False

        while(not encontrado and contador < len(data)):
            encontrado = self.comprobarCaracteres(
                list(data.values())[contador])

            contador = contador + 1

        if(encontrado):
            return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

        newValues = {
            "uuid": str(uuid.uuid1()),
            "emisor": data["usuario"],
            "receptor": conv["emisor"],
            "asunto": "Re: " + conv["asunto"],
            "texto": data["texto"],
            "fecha": datetime.now(),
            "visto": 0
        }

        self.conversaciones.insert_one(newValues)
        conv = self.conversaciones.find_one(
            {"uuid": newValues["uuid"]}, {"_id": 0})

        if(conv == None):
            return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
        else:
            return JsonResponse({"ok": True, "conversacion": conv}, safe=False)
