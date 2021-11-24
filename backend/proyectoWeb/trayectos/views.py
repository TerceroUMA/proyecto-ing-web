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

    def get(self, request, idUsuario):

        if(request.GET.get("uuid") == None):
            origen = request.GET.get("origen")
            destino = request.GET.get("destino")
            precio = request.GET.get("precio")
            plazasDisponibles = request.GET.get("plazasDisponibles")
            fechaDeSalida = request.GET.get("fechaDeSalida")
            horaDeSalida = request.GET.get("horaDeSalida")
        
            data = {
                "origen": origen,
                "destino": destino,
                "precio": precio,
                "duracion": 1, #este no es la duración del trayecto, pero lo utilizamos en el data para que no de error
                "plazasDisponibles": plazasDisponibles,
                "fechaDeSalida": fechaDeSalida,
                "horaDeSalida": horaDeSalida,
                "conductor": idUsuario #este no es el conductor del trayecto pero lo utilizamos en el data para que no de error
            }

            exito, jsonData = self.comprobaciones(data)

            if(exito):
                str = "{"
                str = str + "origen: " + origen if origen != None or origen != "" else str + \
                    "origen: { $exists: true}"
                str = str + "destino: " + destino if destino != None or destino != "" else str + \
                    "destino: { $exists: true}"
                str + "}"
                print(str)

                lista = list(self.trayectos.find(str, {"_id":0}))

                for t in lista:

                    if precio == None or precio == "": precio = 0.0
                    if plazasDisponibles == None or precio == "": plazasDisponibles = 0
                    if fechaDeSalida == None or fechaDeSalida == "": fechaDeSalida = datetime.now
                    if horaDeSalida == None or fechaDeSalida == "": horaDeSalida = datetime.now
                    
                    condicion = (t["conductor"] == idUsuario or idUsuario in list(t["pasajeros"]) or 
                                precio > float(t["precio"]) or plazasDisponibles < int(t["plazasDisponibles"]))

                    if condicion:
                        lista.remove(t)
                    else:
                        fecha = t["fechaDeSalida"]
                        fecha_dt = datetime.strptime(fecha, '%d/%m/%Y')

                        hora = t["fechaDeSalida"]
                        hora_dt = datetime.strptime(hora, '%H:%M')

                        if(fecha_dt < fechaDeSalida and hora_dt < horaDeSalida):
                            lista.remove(t)
                    

                if lista == None:
                    return JsonResponse({"ok": "false", "msg": 'No hay trayectos disponibles'}, safe=False)

                return JsonResponse({"ok": "true", "trayectos": lista}, safe=False)
            
            else:
                return jsonData

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
                "plazasDisponibles": data["plazasDisponibles"],
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
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        if(tr == None):
            return JsonResponse({"ok": "false", "msg": 'No se ha encontrado un trayecto con ese id'}, safe=False)
        else:
            self.trayectos.delete_one(tr)
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
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id" : 0})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

        self.trayectos.update_one(filtro,
            {"$set": {"plazasDisponibles": str(int(tr["plazasDisponibles"]) - 1)}})
        self.trayectos.update_one(filtro,
            {"$push": {"pasajeros": data["idUsuario"]}})

        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id" : 0})

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
        tr = self.trayectos.find_one({"uuid": data["uuid"]}, {"_id": 0})
        filtro = {"uuid": data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe=False)

        self.trayectos.update_one(
            filtro, {"$set": {"plazasDisponibles": str(int(tr["plazasDisponibles"]) + 1)}})
        self.trayectos.update_one(
            filtro, {"$push": {"pasajeros": tr["pasajeros"].remove(data["idUsuario"])}})

        return JsonResponse({"ok": "true", "pasajeros": tr["pasajeros"]}, safe=False)
