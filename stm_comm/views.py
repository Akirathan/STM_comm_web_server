from datetime import datetime
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager
from .models import Device


def parse_update_temp_req(request: HttpRequest) -> (int, float):
    """
    Parses "POST temperature request" from device.
    :param request:
    :return: (timestamp, temperature)
    """
    body_str = request.body.decode()
    lines = body_str.splitlines()
    timestamp = int(lines[0])
    temp = float(lines[1])
    return timestamp, temp


@csrf_exempt
def update_temp(request: HttpRequest) -> HttpResponse:
    """
    Device periodically POSTs temperature via this URL.
    :param request: must be POST type
    """
    if request.method != 'POST':
        return HttpResponse(status=400)

    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(status=404)

    (timestamp, temp) = parse_update_temp_req(request)
    device.set_temperature(timestamp, temp)

    return HttpResponse()


@csrf_exempt
def connect(request: HttpRequest) -> HttpResponse:
    """ First message from STM device """
    if request.method != 'POST':
        return HttpResponse(status=400)

    # Check if the device is in the device database
    # TODO: decode from DES
    device_id = request.body.decode()
    device = get_object_or_404(Device, device_id=device_id)
    device.set_online()

    ConnectionManager.add_device(device_id, request.META['REMOTE_ADDR'])

    return HttpResponse(int(datetime.now().timestamp()))

