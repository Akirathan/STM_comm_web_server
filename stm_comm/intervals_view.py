from datetime import datetime
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager
from .models import Device


@csrf_exempt
def get_intervals_timestamp(request: HttpRequest) -> HttpResponse:
    if request.method != 'GET':
        return HttpResponse(404)

    device_id = ConnectionManager.get_device_id_from_request(request)

    return HttpResponse()
