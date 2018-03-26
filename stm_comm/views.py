from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpRequest
from .connection_manager import ConnectionManager
from .models import Device


# Create your views here.
def actual(request: HttpRequest, actual_item: str) -> HttpResponse:
    print('in view, actual_item=%s' % actual_item)
    return HttpResponse()


def connect(request: HttpRequest, device_id: str) -> HttpResponse:
    """ First message from STM device """
    # Check if the device is in the device database
    device = get_object_or_404(Device, pk=device_id)
    device.set_online()

    ConnectionManager.add_device(device_id, request.get_host(), request.get_port())
    return HttpResponse()

