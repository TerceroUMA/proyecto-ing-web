from django.views import View
from django.http import QueryDict
from django.http.response import HttpResponse, JsonResponse
import pymongo
from pymongo import MongoClient
import json
import certifi
import uuid
import bcrypt
# Create your views here.

class Datos(View):
    
    def get(self):
        
        return HttpResponse("Prueba")