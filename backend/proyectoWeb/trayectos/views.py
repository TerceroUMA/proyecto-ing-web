from django.views import View
from django.http import QueryDict
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid

# Create your views here.
class Trayectos(View):
    def __init__(self):
        client = MongoClient('mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        self.trayectos = db.trayectos
        self.usuarios = db.users

    #Devuelve el listado completo de trayectos. Si no hay plazas disponibles no se devuelve el trayecto.
    def getAll (self):
        lista = []

        for t in self.trayectos.find({}, {"_id": 0}):
            if(t["plazasDisponibles"] < 0):
                lista.append(t)
        
        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'No hay trayectos disponibles'}, safe = False)
            
        return JsonResponse({"ok": "true", "trayectos": lista}, safe = False)

    #Devuelve todos los datos del trayecto que coincida con el id proporcionado.
    def get (self, request):
        tr = self.trayectos.find_one({"uuid": request.GET.get("uuid")},{"_id": 0})
        if tr == None:

            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

        return JsonResponse({"ok": "true", "trayecto": tr}, safe = False)

    #Devuelve el listado de los trayectos creados por el usuario. El id del usuario es pasado como path parameter.
    def getListDriver (self, request):
        us = self.usuarios.find_one({"uuid" : request.GET.get("uuid")}, {"_id" : 0})

        if us == None: 
            return JsonResponse({"ok": "false", "msg": 'No se encuentra a ningún usuario con ese id'}, safe = False)
        
        trs = self.trayectos.find({"conductor" : request.GET.get("uuid")}, {"_id" : 0})

        if trs == None:
            return JsonResponse({"ok": "false", "msg": 'Este usuario no ha creado ningún trayecto'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": trs}, safe = False)
    
    #Devuelve el listado de los trayectos en los que el usuario se ha inscrito. El id del usuario es pasado como path parameter.
    def getListPassenger (self, request):
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

    #Crea un trayecto nuevo.
    def post (self, request):
        tr = {
            "uuid" : str(uuid.uuid1()),
            "origen": request.GET.get("origen"),
            "destino": request.GET.get("destino"),
            "tipoDeVehiculo": request.GET.get("tipoDeVehiculo"),
            "conductor": request.GET.get(self.usuarios.find_one({"uuid": request.GET.get("conductor")}, {"_id": 0})),  
            "duracion": request.GET.get("duracion"),
            "precio": request.GET.get("precio"),
            "plazasDisponible": request.GET.get("plazasDisponibles"),
            "fechaDeSalida": request.GET.get("fechaDeSalida"),
            "horaDeSalida": request.GET.get("horaDeSalida"),
            "periodicidad": request.GET.get("preriodicidad")
        }
        
        self.trayectos.insert_one(tr)

        return JsonResponse({"ok": "true", "trayecto": tr})
        
    
    #Un usuario se inscribe a un trayecto existente.
    def subs (self, request):
        tr = self.trayectos.fin_one({"uuid" : request.GET.get("uuid")})

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

        self.trayectos.update_one(tr, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] - 1}})
        self.trayectos.update_one(tr, {"$ set": {"pasajeros": tr["pasajeros"].append(request.GET.get("idUsuario"))}})

        return JsonResponse({"ok : true", "pasajeros": tr["pasajeros"]}, safe = False)

    #Un usuario se desinscribe de un trayecto existente.
    def unsubs (self, request):
        tr = self.trayectos.fin_one({"uuid" : request.GET.get("uuid")})

        if tr == None:
            return JsonResponse({"ok": "false", "msg": 'No se encuentra ningún trayecto con ese id'}, safe = False)

        self.trayectos.update_one(tr, {"$ set": {"plazasDisponibles": tr["plazasDisponible"] + 1}})
        self.trayectos.update_one(tr, {"$ set": {"pasajeros": tr["pasajeros"].remove(request.GET.get("idUsuario"))}})

        return JsonResponse({"ok : true", "pasajeros" : tr["pasajeros"]}, safe = False)

    #Actualiza los datos del trayecto que coincida con el id proporcionado.
    def put(self, request):
        
        return JsonResponse()

    #Borra el trayecto que coincida con el id proporcionado.
    def delete(self, request):
        self.trayectos.find_one_and_delete({"uuid" : request.GET.get("uuid")}, {"_id": 0})

        return JsonResponse({"ok" : "true"})
    
    #Devuelve una lista con todos los trayectos de un punto de origen
    def getListOrigin(self, request):
        lista = []
        for t in self.trayectos.find({}, {"_id" : 0}):
            if(t["origen"].find(request.GET.get("origen")) >= 0):
                lista.append(t)
        
        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'No hay trayectos que partan de este punto'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": lista}, safe = False)
    
    #Devuelve una lista con todos los trayectos de un punto de destino
    def getListOrigin(self, request):
        lista = []
        for t in self.trayectos.find({}, {"_id" : 0}):
            if(t["destino"].find(request.GET.get("destino")) >= 0):
                lista.append(t)
        
        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'No hay trayectos que finalicen en este punto'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": lista}, safe = False)

    #Devuelve una lista con todos los trayectos cuya fecha sea superior a la dada.
    def getListOrigin(self, request):
        lista = []
        for t in self.trayectos.find({}, {"_id" : 0}):
            if(request.GET.get("fecha") <= t["fechaDeSalida"]):
                lista.append(t)
        
        if lista == None:
            return JsonResponse({"ok": "false", "msg": 'No hay trayectos para esta fecha'}, safe = False)

        return JsonResponse({"ok" : "true", "trayectos": lista}, safe = False)
    

 
