from django.views import View
from django.http.response import HttpResponse, JsonResponse
from pymongo import MongoClient
import certifi
import uuid

# Create your views here.


class Conversacion(View):

    def __init__(self):
        client = MongoClient(
            'mongodb+srv://root:root@bdingweb.5axsz.mongodb.net/', tlsCAFile=certifi.where())

        db = client['IngWeb']
        #self.conversacions = db.conversaciones

    def get(self, request):
        return
