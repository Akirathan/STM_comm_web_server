from datetime import datetime
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager
from .models import Device

REF_DATE = datetime(year=2000, month=1, day=1)


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

    device_id = ConnectionManager.get_device_id(request.META['REMOTE_ADDR'])
    if device_id is None:
        # Error: device not connected
        return HttpResponse(status=400)

    device = get_object_or_404(Device, device_id=device_id)

    (timestamp, temp) = parse_update_temp_req(request)
    device.set_temperature(timestamp, temp)

    return HttpResponse()


@csrf_exempt
def connect(request: HttpRequest) -> HttpResponse:
    """ First message from STM device """
    if request.method != 'POST':
        return HttpResponse(status=400)

    # Check if the device is in the device database
    device_id = request.body.decode()
    device = get_object_or_404(Device, device_id=device_id)
    device.set_online()

    ConnectionManager.add_device(device_id, request.META['REMOTE_ADDR'])

    time_delta = datetime.now() - REF_DATE
    time_delta_seconds = int(time_delta.total_seconds())

    return HttpResponse(time_delta_seconds)

