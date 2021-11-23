from datetime import datetime, date
from django.views import View
from django.http import QueryDict
from django.http.response import JsonResponse
from pymongo import MongoClient
import certifi
import uuid

# Create your views here.


class Trayectos(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    # Devuelve el listado completo de trayectos. Si no hay plazas disponibles no se devuelve el trayecto.

    # Devuelve todos los datos del trayecto que coincida con el id proporcionado.

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
            return False, JsonResponse({"ok": "false", "msg": "No se pueden usar carácteres no válidos"}, safe=False)

        duracion = float(data["duracion"])
        if(duracion < 0):
            return False, JsonResponse({"ok:": "false", "msg": 'La duracion no puede ser negativa'}, safe=False)

        if(duracion == 0):
            return False, JsonResponse({"ok:": "false", "msg": 'La duracion no puede ser cero'}, safe=False)

        precio = float(data["precio"])
        if(precio < 0):
            return False, JsonResponse({"ok:": "false", "msg": 'El precio no puede ser negativo'}, safe=False)

        if(precio == 0):
            return False, JsonResponse({"ok:": "false", "msg": 'El precio no puede ser cero'}, safe=False)

        plazasDisponibles = int(data["plazasDisponibles"])
        if(plazasDisponibles < 0):
            return False, JsonResponse({"ok:": "false", "msg": 'Las plazas no puede ser negativa'}, safe=False)

        fecha = data["fechaDeSalida"]
        fecha_dt = datetime.strptime(fecha, '%d/%m/%Y')
        now = datetime.now()

        if(fecha_dt <= now):
            return False, JsonResponse({"ok:": "false", "msg": 'La fecha no es válida'}, safe=False)

        idUsuario = data["conductor"]
        us = self.usuarios.find_one({"uuid": idUsuario}, {"_id": 0})

        if(us == None):
            return False, JsonResponse({"ok:": "false", "msg": 'El id del conductor no se encuentra'}, safe=False)

        return True, JsonResponse({"ok": "true"})

    def get(self, request):

        if(request.GET.get("uuid") == None):
            origen = request.GET.get("origen")
            destino = request.GET.get("destino")
            cercania = request.GET.get("cercania")
            precio = request.GET.get("precio")
            duracion = request.GET.get("duracion")
            plazasDisponibles = request.GET.get("plazasDisponibles")
            fechaDeSalida = request.GET.get("fechaDeSalida")
            horaDeSalida = request.GET.get("horaDeSalida")

            str = "{"
            str = str + "origen: " + origen if origen != None else str + \
                "origen: { $exists: true}"
            str = str + "destino: " + destino if destino != None else str + \
                "destino: { $exists: true}"
            str = str + "cercania: " + cercania if cercania != None else str + \
                "cercania: { $exists: true}"
            str = str + "precio: " + precio if precio != None else str + \
                "precio: { $exists: true}"
            str = str + "duracion: " + duracion if duracion != None else str + \
                "duracion: { $exists: true}"
            str = str + "plazasDisponibles: " + plazasDisponibles if plazasDisponibles != None else str + \
                "plazasDisponibles: { $exists: true}"
            str = str + "fechaDeSalida: " + fechaDeSalida if fechaDeSalida != None else str + \
                "fechaDeSalida: { $exists: true}"
            str = str + "horaDeSalida: " + horaDeSalida if horaDeSalida != None else str + \
                "horaDeSalida: { $exists: true}"
            str + "}"
            print(str)

            lista = []

            if lista == None:
                return JsonResponse({"ok": "false", "msg": 'No hay trayectos disponibles'}, safe=False)

            return JsonResponse({"ok": "true", "trayectos": lista}, safe=False)

        else:
            tr = self.trayectos.find_one(
                {"uuid": request.GET.get("uuid")}, {"_id": 0})

            if tr == None:
                return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

            return JsonResponse({"ok": "true", "trayecto": tr}, safe=False)

    # Crea un trayecto nuevo.
    def post(self, request):
        data = QueryDict(request.body)
        exito, jsonData = self.comprobaciones(data)

        if(exito):
            tr = {
                "uuid": str(uuid.uuid1()),
                "origen": data["origen"],
                "destino": data["destino"],
                "tipoDeVehiculo": data["tipoDeVehiculo"],
                "conductor": data["conductor"],
                "duracion": data["duracion"],
                "precio": data["precio"],
                "pasajeros": [],
                "plazasDisponible": data["plazasDisponibles"],
                "fechaDeSalida": data["fechaDeSalida"],
                "horaDeSalida": data["horaDeSalida"],
                "periodicidad": data["periodicidad"]
            }

            self.trayectos.insert_one(tr)

            tr = self.trayectos.find_one({"uuid": tr["uuid"]}, {"_id": 0})

            return JsonResponse({"ok": "true", "trayecto": tr})

        else:
            return jsonData

    # Actualiza los datos del trayecto que coincida con el id proporcionado.

    def put(self, request):
        data = QueryDict(request.body)
    
        exito, jsonData = self.comprobaciones(data)
        if(exito):
            filter = {'uuid': data["uuid"]}

            if(self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0}) == None):
                return JsonResponse({"ok": "false", "msg": 'No se ha encontrado un usuario con ese id'}, safe=False)

            newvalues = {"$set": {
                "origen": data["origen"],
                "destino": data["destino"],
                "tipoDeVehiculo": data["tipoDeVehiculo"],
                "conductor": self.usuarios.find_one({"uuid": data["conductor"]}, {"_id": 0}),
                "duracion": data["duracion"],
                "precio": data["precio"],
                "plazasDisponible": data["plazasDisponibles"],
                "fechaDeSalida": data["fechaDeSalida"],
                "horaDeSalida": data["horaDeSalida"],
                "periodicidad": data["preriodicidad"]
            }
            }
            self.trayectos.update_one(filter, newvalues)
            return JsonResponse({"ok": "true"})

        else:
            return jsonData

    # Borra el trayecto que coincida con el id proporcionado.

    def delete(self, request):
        data = QueryDict(request.body)
        self.trayectos.find_one_and_delete({"uuid": data["uuid"]}, {"_id": 0})

        return JsonResponse({"ok": "true"})


class TrayectosCreados(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def get(self, request):

        us = self.usuarios.find_one(
            {"uuid": request.GET.get("uuid")}, {"_id": 0})

        if us == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe=False)

        trs = self.trayectos.find(
            {"conductor": request.GET.get("uuid")}, {"_id": 0})

        if trs == None:
            return JsonResponse({"ok": "false", "msg": 'Este usuario no ha creado ningún trayecto'}, safe=False)

        return JsonResponse({"ok": "true", "trayectos": trs}, safe=False)


class TrayectosInscritos(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def get(self, request):
        us = self.usuarios.find_one(
            {"uuid": request.GET.get("uuid")}, {"_id": 0})

        if us == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe=False)

        lista = []
        for t in self.trayectos.find({}, {"_id": 0}):
            if(request.GET.get("uuid") in t["pasajeros"]):
                lista.append(t)

        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'Este usuario no es pasajero de ningún trayecto'}, safe=False)

        return JsonResponse({"ok": "true", "trayectos": lista}, safe=False)


class Inscripcion(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def post(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.fin_one({"uuid": data["uuid"]})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

        self.trayectos.update_one(
            filtro, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] - 1}})
        self.trayectos.update_one(
            filtro, {"$ set": {"pasajeros": tr["pasajeros"].append(data["idUsuario"])}})

        return JsonResponse({"ok": "true", "pasajeros": tr["pasajeros"]}, safe=False)


class Desinscripcion(View):
    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def post(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid": data["uuid"]})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

        self.trayectos.update_one(
            filtro, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] + 1}})
        self.trayectos.update_one(
            filtro, {"$ set": {"pasajeros": tr["pasajeros"].remove(data["idUsuario"])}})

        return JsonResponse({"ok": "true", "pasajeros": tr["pasajeros"]}, safe=False)
