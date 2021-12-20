from collections import _OrderedDictValuesView
from datetime import datetime
from django.views import View
from django.http import QueryDict
from django.http.response import JsonResponse
from django.views.generic.base import TemplateResponseMixin
from pymongo import MongoClient
import certifi
import uuid
import sys

import cloudinary
import cloudinary.uploader
import cloudinary.api

# Create your views here.


class Trayectos(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def comprobarCaracteres(self, dato):
        if(dato.find("'") >= 0 or dato.find('"') >= 0 or dato.find("{") >= 0 or dato.find("}") >= 0 or dato.find("$") >= 0):
            return True
        else:
            return False

    def comprobaciones(self, data):

        encontrado = False
        contador = 0

        while(not encontrado and contador < len(data)):
            encontrado = self.comprobarCaracteres(
                list(data.values())[contador])

            contador = contador + 1

        if(encontrado):
            return False, JsonResponse({"ok": False, "msg": "No se pueden usar caracteres no válidos"}, safe=False)

        duracion = float(data["duracion"])
        if(duracion < 0):
            return False, JsonResponse({"ok:": False, "msg": 'La duración no puede ser negativa'}, safe=False)

        if(duracion == 0):
            return False, JsonResponse({"ok:": False, "msg": 'La duración no puede ser cero'}, safe=False)

        periodicidad = int(data["periodicidad"])
        if(periodicidad < 0):
            return False, JsonResponse({"ok": False, "msg": "La periodicidad no puede ser negativa"})

        precio = float(data["precio"])
        if(precio < 0):
            return False, JsonResponse({"ok:": False, "msg": 'El precio no puede ser negativo'}, safe=False)

        if(precio == 0):
            return False, JsonResponse({"ok:": False, "msg": 'El precio no puede ser cero'}, safe=False)

        plazasDisponibles = int(data["plazasDisponibles"])
        if(plazasDisponibles < 0):
            return False, JsonResponse({"ok:": False, "msg": 'El número de plazas disponibles no puede ser negativo'}, safe=False)

        fecha = data["fechaDeSalida"]
        try:
            fecha_dt = datetime.strptime(fecha, '%Y-%m-%d')

            now = datetime.now()

            if(fecha_dt <= now):
                return False, JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

        except ValueError:
            return False, JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

        idUsuario = data["conductor"]
        us = self.usuarios.find_one({"uuid": idUsuario}, {"_id": 0})

        if(us == None):
            return False, JsonResponse({"ok:": False, "msg": 'No se encuentra a ningún conductor con el id introducido'}, safe=False)

        return True, JsonResponse({"ok": True})

    # Devuelve el listado completo de trayectos. Si no hay plazas disponibles no se devuelve el trayecto.

    # Devuelve todos los datos del trayecto que coincida con el id proporcionado.

    def get(self, request):

        if(request.GET.get("uuid") == None):
            origen = request.GET.get("origen")
            destino = request.GET.get("destino")
            precio = request.GET.get("precio")
            plazasDisponibles = request.GET.get("plazasDisponibles")
            fechaDeSalida = request.GET.get("fechaDeSalida")
            usuarioConectado = request.GET.get("idUsuario")
            fecha_dt = datetime.now

            if precio == None or precio == "":
                precio = str(sys.float_info.max)
            elif float(precio) < 0.0:
                return JsonResponse({"ok:": False, "msg": 'El precio no puede ser negativo'}, safe=False)

            if plazasDisponibles == None or plazasDisponibles == "":
                plazasDisponibles = "0"
            elif int(plazasDisponibles) < 0:
                return JsonResponse({"ok:": False, "msg": 'El número de plazas disponibles no puede ser negativo'}, safe=False)

            try:
                if fechaDeSalida == None or fechaDeSalida == "":
                    fecha_dt = datetime.strptime("0001-01-01", '%Y-%m-%d')
                else:
                    fecha_dt = datetime.strptime(fechaDeSalida, '%Y-%m-%d')

                    now = datetime.now()

                    if(fecha_dt <= now):
                        return JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

            except ValueError:
                return JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

            lista = list(self.trayectos.find({}, {"_id": 0}))

            for t in self.trayectos.find({}, {"_id": 0}):

                fecha = t["fechaDeSalida"]
                fecha_aux = datetime.strptime(fecha, '%Y-%m-%d')
                condicion = (t["conductor"] == usuarioConectado or usuarioConectado in list(t["pasajeros"]) or
                             float(precio) < float(t["precio"]) or int(plazasDisponibles) > int(t["plazasDisponibles"]) or
                             fecha_aux < fecha_dt)

                if(not (origen == None) and not (origen == "")):
                    condicion = condicion or origen.find(t["origen"]) < 0
                if(not (destino == None) and not (destino == "")):
                    condicion = condicion or destino.find(t["destino"]) < 0
                if condicion:
                    lista.remove(t)
                else:
                    us = self.usuarios.find_one(
                        {"uuid": t["conductor"]}, {"_id": 0})
                    nombre = us["nombre"] + " " + us["apellidos"]
                    t.update({"conductor": nombre})

            if lista == None:
                lista = []
            else:
                for t in lista:
                    us = self.usuarios.find_one(
                        {"uuid": t["conductor"]}, {"_id": 0})
                    nombre = us["nombre"] + " " + us["apellidos"]
                    t.update({"conductor": nombre})

            return JsonResponse({"ok": True, "trayectos": lista}, safe=False)

        else:
            tr = self.trayectos.find_one(
                {"uuid": request.GET.get("uuid")}, {"_id": 0})

            if tr == None:
                return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con el id introducido'}, safe=False)

            us = self.usuarios.find_one({"uuid": tr["conductor"]}, {"_id": 0})
            nombre = us["nombre"] + " " + us["apellidos"]
            tr.update({"conductor": nombre})
            tr["idConductor"] = us["uuid"]

            return JsonResponse({"ok": True, "trayecto": tr}, safe=False)

    # Crea un trayecto nuevo.
    def paramVacio(self, data):
        condicionNull = False
        for d in data.values():
            if(d is None or d == ""):
                condicionNull = True

        return condicionNull, JsonResponse({"ok:": False, "msg": 'Existe algún campo vacío'}, safe=False)


    def post(self, request):
        data = request.POST.dict()

        vacio, jsonDataVacio = self.paramVacio(data)

        if(not vacio):
            exito, jsonData = self.comprobaciones(data)

            if(exito):

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

                tr = {
                    "uuid": str(uuid.uuid1()),
                    "origen": data["origen"],
                    "destino": data["destino"],
                    "tipoDeVehiculo": data["tipoDeVehiculo"],
                    "conductor": data["conductor"],
                    "duracion": data["duracion"],
                    "precio": data["precio"],
                    "pasajeros": [],
                    "plazasDisponibles": data["plazasDisponibles"],
                    "fechaDeSalida": data["fechaDeSalida"],
                    "horaDeSalida": data["horaDeSalida"],
                    "periodicidad": data["periodicidad"],
                    "imagen": url
                }

                self.trayectos.insert_one(tr)

                tr = self.trayectos.find_one({"uuid": tr["uuid"]}, {"_id": 0})

                return JsonResponse({"ok": True, "trayecto": tr})

            else:
                return jsonData

        else:
            return jsonDataVacio

    # Actualiza los datos del trayecto que coincida con el id proporcionado.

    def put(self, request):

        data = QueryDict(request.body)
        
        vacio, jsonDataVacio = self.paramVacio(data)

        if(not vacio):
            exito, jsonData = self.comprobaciones(data)

            if(exito):

                filter = {'uuid': data["uuid"]}

                if(self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0}) == None):
                    return JsonResponse({"ok": False, "msg": 'No se ha ningun trayecto con ese id'}, safe=False)

            
                newvalues = {"$set": {
                    "origen": data["origen"],
                    "destino": data["destino"],
                    "tipoDeVehiculo": data["tipoDeVehiculo"],
                    "conductor": data["conductor"],
                    "duracion": data["duracion"],
                    "precio": data["precio"],
                    "plazasDisponibles": data["plazasDisponibles"],
                    "fechaDeSalida": data["fechaDeSalida"],
                    "horaDeSalida": data["horaDeSalida"],
                    "periodicidad": data["periodicidad"],
                }
                }

                self.trayectos.update_one(filter, newvalues)
                tr = self.trayectos.find_one(
                    {"uuid": data["uuid"]}, {"_id": 0})

                return JsonResponse({"ok": True, "trayecto": tr})

            else:
                return jsonData

        else:
            return jsonDataVacio

    # Borra el trayecto que coincida con el id proporcionado.

    def delete(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if(tr == None):
            return JsonResponse({"ok": False, "msg": 'No se ha encontrado un trayecto con el id introducido'}, safe=False)
        else:
            self.trayectos.delete_one(tr)
            return JsonResponse({"ok": True})


class TrayectosCreados(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def get(self, request, idUsuario):

        trs = self.trayectos.find(
            {"conductor": idUsuario}, {"_id": 0})

        if trs != None:
            trs = sorted(trs, key=lambda x: x["fechaDeSalida"])
            trs.reverse()

        sorted(trs, key=lambda x: x['fechaDeSalida'])

        return JsonResponse({"ok": True, "trayectos": trs}, safe=False)


class TrayectosInscritos(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def get(self, request, idUsuario):

        lista = []
        for t in self.trayectos.find({}, {"_id": 0}):
            if(idUsuario in t["pasajeros"]):
                lista.append(t)

        if lista != None:
            lista = sorted(lista, key=lambda x: x["fechaDeSalida"])
            lista.reverse()

        sorted(lista, key=lambda x: x['fechaDeSalida'])

        return JsonResponse({"ok": True, "trayectos": lista}, safe=False)


class Inscripcion(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def post(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con el id introducido'}, safe=False)

        self.trayectos.update_one(filtro,
                                  {"$set": {"plazasDisponibles": str(int(tr["plazasDisponibles"]) - 1)}})
        self.trayectos.update_one(filtro,
                                  {"$push": {"pasajeros": data["idUsuario"]}})

        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})

        return JsonResponse({"ok": True, "pasajeros": tr["pasajeros"]}, safe=False)


class Desinscripcion(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def post(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con el id introducido'}, safe=False)

        self.trayectos.update_one(
            filtro, {"$set": {"plazasDisponibles": str(int(tr["plazasDisponibles"]) + 1)}})

        lista = list(tr["pasajeros"])
        lista.remove(data["idUsuario"])
        if(lista == None):
            lista = []

        self.trayectos.update_one(
            filtro, {"$set": {"pasajeros": lista}})

        return JsonResponse({"ok": True, "pasajeros": lista}, safe=False)
