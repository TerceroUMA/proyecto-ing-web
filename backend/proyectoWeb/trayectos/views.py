from django.shortcuts import render

# Create your views here.
class TrayectosList(View):
    #Devuelve el listado completo de trayectos. Si no hay plazas disponibles no se devuelve el trayecto.
    def get (self, request):
        return JsonResponse()

    #Devuelve todos los datos del trayecto que coincida con el id proporcionado.
    def get (self, request):
        return JsonResponse()

    #Devuelve el listado de los trayectos creados por el usuario. El id del usuario es pasado como path parameter.
    def get (self, request):
        return JsonResponse()
    
    #Devuelve el listado de los trayectos en los que el usuario se ha inscrito. El id del usuario es pasado como path parameter.
    def get (self, request):
        return JsonResponse()

    #Crea un trayecto nuevo.
    def post (self, request):
        return JsonResponse()
    
    #Un usuario se inscribe a un trayecto existente.
    def post (self, request):
        return JsonResponse()

    #Un usuario se desinscribe de un trayecto existente.
    def post (self, request):
        return JsonResponse()

    #Actualiza los datos del trayecto que coincida con el id proporcionado.
    def put(self, request):
        return JsonResponse()

    #Borra el trayecto que coincida con el id proporcionado.
    def delete(self, request):
        return JsonResponse()
 
