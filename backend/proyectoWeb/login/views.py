from django.views import View
from django.http.response import JsonResponse

# Create your views here.


class UsersList(View):
    def get(self, request):
        # False indica que devolveremos un array de json y no un unico json
        return JsonResponse(['a', 'b', 'c'], safe=False)

    def post(self, request):
        dict = {
            "name": "John",
            "age": 30,
            "city": "New York"
        }
        return JsonResponse(dict, safe=False)
