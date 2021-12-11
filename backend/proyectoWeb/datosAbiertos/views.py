from django.views import View
from django.http.response import HttpResponse, JsonResponse
import json
import requests
# Create your views here.


class DatosCoches(View):

    def __init__(self):
        self.url = "https://car-data.p.rapidapi.com/cars"

        self.headers = {
            'x-rapidapi-host': "car-data.p.rapidapi.com",
            'x-rapidapi-key': "11c75cea66mshb7ff6aa4ca60d66p12b9e1jsnfbc776f2b6ce"
        }

        self.resultados = 10

    def get(self, request):

        anyo = request.GET.get("anyo")
        marca = request.GET.get("marca")
        tipo = request.GET.get("tipo")
        nPag = int(request.GET.get("pagina"))

        parametros = {"limit": str(self.resultados), "page": str(nPag)}

        if(anyo != None):
            parametros["year"] = anyo

        if(marca != None):
            parametros['make'] = marca

        if(tipo != None):
            parametros['type'] = tipo

        response = requests.request(
            "GET", self.url, headers=self.headers, params=parametros).text

        respFinal = json.loads(response)

        return JsonResponse({"ok": True, "coches": respFinal}, safe=False)


class DatosGasolineras(View):

    def __init__(self):

        # Consultas de Datos Abiertos

        self.resultados = 10

        # Conjunto de gasolineras españolas
        
        url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'

        gasolineras = requests.get(url).text
        self.gasolinerasJson = json.loads(gasolineras)

    def get(self, request):

        provincia = request.GET.get("provincia")
        municipio = request.GET.get("municipio")
        precio = request.GET.get("precio")
        nPag = int(request.GET.get("pagina"))

        cont = 0
        skip = 0
        res = []
        condicion = True

        for gasolinera in self.gasolinerasJson['ListaEESSPrecio']:
            if gasolinera['Precio Gasoleo A'] == None or gasolinera['Precio Gasoleo A'] == "":
                gasolinera['Precio Gasoleo A'] = "-1.0"

            gasolinera['Precio Gasoleo A'] = float(
                gasolinera['Precio Gasoleo A'].replace(",", "."))

        gasolinerasOrdenadas = sorted(
            self.gasolinerasJson['ListaEESSPrecio'], key=lambda x: x['Precio Gasoleo A'])

        for gasolinera in gasolinerasOrdenadas:
            condicion = True
            precioGasA = gasolinera['Precio Gasoleo A']
            if(precio != None and precio != ""):
                condicion = condicion and precioGasA < float(
                    precio) and precioGasA != -1.0
            if(provincia != None and provincia != ""):
                condicion = condicion and gasolinera['Provincia'].casefold().find(
                    provincia.casefold()) >= 0
            if(municipio != None and municipio != ""):
                condicion = condicion and gasolinera['Municipio'].casefold().find(
                    municipio.casefold()) >= 0

            if skip >= nPag*self.resultados and cont < self.resultados and condicion:
                res.append(gasolinera)
                cont += 1
            skip += 1

        return JsonResponse({"ok": True, "gasolineras": res}, safe=False)
