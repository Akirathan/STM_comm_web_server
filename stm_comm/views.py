from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.utils import timezone
from .connection_manager import ConnectionManager
from .models import Device, Item


def actual(request: HttpRequest, actual_item_name: str) -> HttpResponse:
    """
    Device periodically POSTs values via this URL.
    :param request: must be POST type and include "value" key
    :param actual_item_name: name of the item that device wants to update
    :return:
    """
    if len(request.POST.dict()) == 0:
        # Error: request is not POST type
        return HttpResponse(status=400)

    device_id = ConnectionManager.get_device_id(request.get_host(), request.get_port())
    if device_id is None:
        # Error: device not connected
        return HttpResponse(status=400)

    # Get device and corresponding item from the database
    device = get_object_or_404(Device, device_id=device_id)
    item = get_object_or_404(device.item_set, name=actual_item_name)

    if item.type != 'actual':
        # Error: wrong item type
        return HttpResponse(status=400)

    # Parse the value from POST request
    try:
        value = request.POST['value']
    except KeyError:
        # Error: wrong format of POST request
        return HttpResponse(status=400)

    # Insert the value in the database.
    item.value = value
    item.time = timezone.now()
    item.save()

    return HttpResponse()


def connect(request: HttpRequest, device_id: str) -> HttpResponse:
    """ First message from STM device """
    # Check if the device is in the device database
    device = get_object_or_404(Device, device_id=device_id)
    device.set_online()

    ConnectionManager.add_device(device_id, request.get_host(), request.get_port())
    return HttpResponse()

