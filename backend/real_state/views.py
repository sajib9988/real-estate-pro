from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome from real_state home!"})
