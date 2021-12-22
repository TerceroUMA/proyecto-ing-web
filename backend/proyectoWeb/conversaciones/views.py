from datetime import date, datetime
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

            id = request.GET.get("idUsuario")
            us = self.usuarios.find_one({"uuid": id}, {"_id": 0})

            if(us == None):
                return JsonResponse({"ok": False, "msg": "No existe ningun usuario con este id"}, safe=False)

            lista = list(self.conversaciones.find(
                {"receptor": us["correo"]}, {"_id": 0}))
            res = list(self.conversaciones.find(
                {"receptor": us["correo"]}, {"_id": 0}))
            visto = request.GET.get("visto")
            fecha = request.GET.get("fecha")
            correo = request.GET.get("correo")

            if((visto == None or visto == "") and (fecha == None or fecha == "") and (correo == None or correo == "")):
                return JsonResponse({"ok": True, "conversaciones": lista})

            else:

                if (visto != None and visto != ""):
                    for c in res:
                        if c["visto"] == 1:
                            lista.remove(c)

                if (fecha != None and fecha != ""):
                    fecha_dt = datetime.strptime(fecha, '%Y-%m-%d')
                    for c in res:
                        if c["fecha"] < fecha_dt:
                            lista.remove(c)

                if (correo != None and correo != ""):
                    for c in res:
                        if not correo in c["emisor"]:
                            lista.remove(c)

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

        id = request.GET.get("idUsuario")
        us = self.usuarios.find_one({"uuid": id}, {"_id": 0})
        if(us == None):
            return JsonResponse({"ok": False, "msg": "No existe ningun usuario con este id"}, safe=False)

        contador = 0
        encontrado = False

        while(not encontrado and contador < len(data)):
            encontrado = self.comprobarCaracteres(
                list(data.values())[contador])

            contador = contador + 1

        if(encontrado):
            return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

        if(self.usuarios.find_one({"correo": data["destinatario"]}, {"_id": 0}) == None):
            return False, JsonResponse({"ok": False, "msg": "No existe este destinatario"}, safe=False)

        newValues = {
            "uuid": str(uuid.uuid1()),
            "receptor": data["destinatario"],
            "emisor": us["correo"],
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

            id = request.GET.get("idUsuario")
            us = self.usuarios.find_one({"uuid": id}, {"_id": 0})

            if(us == None):
                return JsonResponse({"ok": False, "msg": "No existe ningun usuario con este id"}, safe=False)

            lista = list(self.conversaciones.find(
                {"emisor": us["correo"]}, {"_id": 0}))
            res = list(self.conversaciones.find(
                {"receptor": us["correo"]}, {"_id": 0}))

            visto = request.GET.get("visto")
            fecha = request.GET.get("fecha")
            correo = request.GET.get("correo")

            if((visto == None or visto == "") and (fecha == None or fecha == "") and (correo == None or correo == "")):
                return JsonResponse({"ok": True, "conversaciones": lista})

            else:
                res = lista
                if (visto != None and visto != ""):
                    for c in res:
                        if c["visto"] == 1:
                            lista.remove(c)

                if (fecha != None and fecha != ""):
                    fecha_dt = datetime.strptime(fecha, '%Y-%m-%d')
                    for c in res:
                        if c["fecha"] < fecha_dt:
                            lista.remove(c)

                if (correo != None and correo != ""):
                    for c in res:
                        if not correo in c["receptor"]:
                            lista.remove(c)

                return JsonResponse({"ok": True, "conversaciones": lista})
        else:
            conv = self.conversaciones.find_one({"uuid": uuid}, {"_id": 0})
            if(conv == None):
                return JsonResponse({"ok": False, "msg": "No existe ninguna conversacion con este id"}, safe=False)
            else:
                return JsonResponse({"ok": True, "conversacion": conv})

    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False

    def post(self, request):
        idConv = request.GET.get("uuid")

        conv = self.conversaciones.find_one({"uuid": idConv}, {"_id": 0})

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

        id = request.GET.get("idUsuario")
        us = self.usuarios.find_one({"uuid": id}, {"_id": 0})

        if(us == None):
            return JsonResponse({"ok": False, "msg": "No existe ningun usuario con este id"}, safe=False)
        newValues = {
            "uuid": str(uuid.uuid1()),
            "emisor": us["correo"],
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
