from datetime import datetime, date
from django.views import View
from django.http import QueryDict
from django.http.response import JsonResponse
from pymongo import MongoClient
import certifi
import uuid
import sys

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
            return False, JsonResponse({"ok": False, "msg": "No se pueden usar carácteres no válidos"}, safe=False)

        duracion = float(data["duracion"])
        if(duracion < 0):
            return False, JsonResponse({"ok:": False, "msg": 'La duracion no puede ser negativa'}, safe=False)

        if(duracion == 0):
            return False, JsonResponse({"ok:": False, "msg": 'La duracion no puede ser cero'}, safe=False)

        precio = float(data["precio"])
        if(precio < 0):
            return False, JsonResponse({"ok:": False, "msg": 'El precio no puede ser negativo'}, safe=False)

        if(precio == 0):
            return False, JsonResponse({"ok:": False, "msg": 'El precio no puede ser cero'}, safe=False)

        plazasDisponibles = int(data["plazasDisponibles"])
        if(plazasDisponibles < 0):
            return False, JsonResponse({"ok:": False, "msg": 'Las plazas no pueden ser negativa'}, safe=False)

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
            return False, JsonResponse({"ok:": False, "msg": 'El id del conductor no se encuentra'}, safe=False)

        return True, JsonResponse({"ok": True})

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
                precio = "0.0"
            elif float(precio) < 0.0:
                return False, JsonResponse({"ok:": False, "msg": 'El precio no puede ser negativo'}, safe=False)

            if plazasDisponibles == None or plazasDisponibles == "":
                    plazasDisponibles = str(sys.maxsize * 2 + 1)
            elif int(plazasDisponibles) < 0:
                return False, JsonResponse({"ok:": False, "msg": 'Las plazas no pueden ser negativa'}, safe=False)

            try:
                if fechaDeSalida == None or fechaDeSalida == "":
                    fecha_dt = datetime.strptime("9999-12-31", '%Y-%m-%d')
                else:
                    fecha_dt = datetime.strptime(fechaDeSalida, '%Y-%m-%d')

                    now = datetime.now()

                    if(fecha_dt <= now):
                        return False, JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

            except ValueError:
                return False, JsonResponse({"ok:": False, "msg": 'La fecha no es válida'}, safe=False)

            lista = list(self.trayectos.find({}, {"_id": 0}))
            
            for t in self.trayectos.find({}, {"_id": 0}):
                fecha = t["fechaDeSalida"]
                fecha_aux = datetime.strptime(fecha, '%Y-%m-%d')
                condicion = (t["conductor"] == usuarioConectado or usuarioConectado in list(t["pasajeros"]) or
                            float(precio) <= float(t["precio"]) or int(plazasDisponibles) <= int(t["plazasDisponibles"]) or  
                            fecha_aux <= fecha_dt) 
                
                if(not (origen == None) and not (origen == "")): 
                    condicion = condicion or origen.find(t["origen"]) < 0
                if(not (destino == None) and not (destino == "")):
                    condicion = condicion or destino.find(t["destino"]) < 0
                if condicion:
                    lista.remove(t)

            if lista == None:
                return JsonResponse({"ok": False, "msg": 'No hay trayectos disponibles'}, safe=False)

            return JsonResponse({"ok": True, "trayectos": lista}, safe=False)

        else:
            tr = self.trayectos.find_one(
                {"uuid": request.GET.get("uuid")}, {"_id": 0})

            if tr == None:
                return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

            return JsonResponse({"ok": True, "trayecto": tr}, safe=False)

    # Crea un trayecto nuevo.
    def paramVacio(self, data):
        condicionNull = False
        for d in data.values():
            print(d)
            if(d is None or d == ""):
                condicionNull = True

        return condicionNull, JsonResponse({"ok:": False, "msg": 'Existe algún campo vacío'}, safe=False)

    def post(self, request):
        data = QueryDict(request.body)
        vacio, jsonDataVacio = self.paramVacio(data)

        if(not vacio):
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
                    return JsonResponse({"ok": False, "msg": 'No se ha ningun trayecti con ese id'}, safe=False)

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
                    "periodicidad": data["periodicidad"]
                }
                }

                self.trayectos.update_one(filter, newvalues)
                return JsonResponse({"ok": True})

            else:
                return jsonData

        else:
            return jsonDataVacio

    # Borra el trayecto que coincida con el id proporcionado.

    def delete(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if(tr == None):
            return JsonResponse({"ok": False, "msg": 'No se ha encontrado un trayecto con ese id'}, safe=False)
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
            return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

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
            return JsonResponse({"ok": False, "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

        self.trayectos.update_one(
            filtro, {"$set": {"plazasDisponibles": str(int(tr["plazasDisponibles"]) + 1)}})

        lista = list(tr["pasajeros"])
        lista.remove(data["idUsuario"])
        if(lista == None):
            lista = []

        self.trayectos.update_one(
            filtro, {"$set": {"pasajeros": lista}})

        return JsonResponse({"ok": True, "pasajeros": lista}, safe=False)
