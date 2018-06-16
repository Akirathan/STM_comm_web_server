from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager


@csrf_exempt
def get_intervals_timestamp(request: HttpRequest) -> HttpResponse:
    if request.method != 'GET':
        return HttpResponse(404)

    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(404)

    return HttpResponse(device.get_intervals_timestamp())
