from datetime import _date, date, datetime, time
from django.views import View
from django.http import QueryDict
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid

from pymongo.message import update

# Create your views here.
class Trayectos(View):
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    #Devuelve el listado completo de trayectos. Si no hay plazas disponibles no se devuelve el trayecto.

    #Devuelve todos los datos del trayecto que coincida con el id proporcionado.
    def comprobaciones(self, data, metodo):

        duracion = data["duracion"]
        if(duracion <= 0):
            return JsonResponse({"ok:": "false", "msg": 'El formato de la duración  no es válido'}, safe = False)
        
        precio = data["precio"]
        if(precio <= 0):
            return JsonResponse({"ok:": "false", "msg": 'El formato del precio no es válido'}, safe = False)
        
        plazasDisponibles = data["plazasDisponibles"]
        if(plazasDisponibles <= 0):
            return JsonResponse({"ok:": "false", "msg": 'El formato de las plazasDisponibles no es válido'}, safe = False)
        
        fecha = data["fechaSalida"]
        hora = data["horaSalida"]
        now = datetime.now()
        
        if(fecha < now.date or hora < now.hour):
            return JsonResponse({"ok:": "false", "msg": 'El formato de la fecha o la hora no es válido'}, safe = False)

        idUsuario = data["conductor"]
        us = self.usuarios.find_one(idUsuario, {"_id" : 0})

        if(us == None):
            return JsonResponse({"ok:": "false", "msg": 'El id del conductor no se encuentra'}, safe = False)
        
        return True


    def get (self, request):
        
        if(request.GET.get("uuid") == None):
            origen = request.GET.get("origen")
            str = "{" 
            str = str + "origen: " + origen if origen != None else str + "origen: { $exists: true}"
            str = str + "destino: " + origen if origen != None else str + "destino: { $exists: true}"
            str = str + "origen: " + origen if origen != None else str + "origen: { $exists: true}"
            str + "}"
            print(str)

            lista = []
            
            if lista == None:
                return JsonResponse({"ok": "false", "msg": 'No hay trayectos disponibles'}, safe = False)
                
            return JsonResponse({"ok": "true", "trayectos": lista}, safe = False)

        else:
            tr = self.trayectos.find_one({"uuid": request.GET.get("uuid")},{"_id": 0})

            if tr == None:
                return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

            return JsonResponse({"ok": "true", "trayecto": tr}, safe = False)

    #Crea un trayecto nuevo.
def post (self, request):
        data = QueryDict(request.body)
        exito = self.comprobaciones(data, "post")
        if(exito):
            tr = {
                "uuid" : str(uuid.uuid1()),
                "origen": data["origen"],
                "destino": data["destino"],
                "tipoDeVehiculo": data["tipoDeVehiculo"],
                "conductor": self.usuarios.find_one({"uuid": data["conductor"]}, {"_id": 0, "password": 0}),
                "duracion": data["duracion"],
                "precio": data["precio"],
                "pasajeros": [],
                "plazasDisponible": data["plazasDisponibles"],
                "fechaDeSalida": data["fechaDeSalida"],
                "horaDeSalida": data["horaDeSalida"],
                "periodicidad": data["periodicidad"]
            }

            self.trayectos.insert_one(tr)

        tr = self.trayectos.find_one({"uuid": tr["uuid"]},{"_id": 0})

        return JsonResponse({"ok": "true", "trayecto": tr})     
    

    #Actualiza los datos del trayecto que coincida con el id proporcionado.
    def put(self, request):
        data = QueryDict(request.body)
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


    #Borra el trayecto que coincida con el id proporcionado.
    def delete(self, request):
        data = QueryDict(request.body)
        self.trayectos.find_one_and_delete({"uuid" : data["uuid"]}, {"_id": 0})

        return JsonResponse({"ok" : "true"})

class TrayectosCreados(View):
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users  

    def get(self, request):

        us = self.usuarios.find_one({"uuid" : request.GET.get("uuid")}, {"_id" : 0})

        if us == None: 
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe = False)
        
        trs = self.trayectos.find({"conductor" : request.GET.get("uuid")}, {"_id" : 0})

        if trs == None:
            return JsonResponse({"ok": "false", "msg": 'Este usuario no ha creado ningún trayecto'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": trs}, safe = False)

class TrayectosInscritos(View):   
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    def get (self, request):
        us = self.usuarios.find_one({"uuid" : request.GET.get("uuid")}, {"_id" : 0})

        if us == None: 
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe = False)
        
        lista = []
        for t in self.trayectos.find({}, {"_id" : 0}):
            if(request.GET.get("uuid") in t["pasajeros"]):
                lista.append(t)

        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'Este usuario no es pasajero de ningún trayecto'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": lista}, safe = False)

class Inscripcion(View):   
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users
    
    def post(self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.fin_one({"uuid" : data["uuid"]})
        filtro = {"uuid" : data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

        self.trayectos.update_one(filtro, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] - 1}})
        self.trayectos.update_one(filtro, {"$ set": {"pasajeros": tr["pasajeros"].append(data["idUsuario"])}})

        return JsonResponse({"ok" : "true", "pasajeros": tr["pasajeros"]}, safe = False)

class Desinscripcion(View):   
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users
    
    def post (self, request):
        data = QueryDict(request.body)
        tr = self.trayectos.find_one({"uuid" : data["uuid"]})
        filtro = {"uuid" : data["uuid"]}

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

        self.trayectos.update_one(filtro, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] + 1}})
        self.trayectos.update_one(filtro, {"$ set": {"pasajeros": tr["pasajeros"].remove(data["idUsuario"])}})

        return JsonResponse({"ok" : "true", "pasajeros" : tr["pasajeros"]}, safe = False)