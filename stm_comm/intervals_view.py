from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager
from .models import Device, Interval


@csrf_exempt
def get_intervals_timestamp(request: HttpRequest) -> HttpResponse:
    if request.method != 'GET':
        return HttpResponse(404)

    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(404)

    return HttpResponse(device.get_intervals_timestamp())


@csrf_exempt
def get_or_post_intervals(request: HttpRequest) -> HttpResponse:
    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(404)

    if request.method == 'GET':
        return get_intervals(device)
    if request.method == 'POST':
        return post_intervals(device, request.body)


def get_intervals(device: Device) -> HttpResponse:
    """
    Returns just serialized intervals, there is no need to add timestamp,
    STM already has it.
    """
    byte_array = bytearray()
    intervals = device.get_intervals()
    for interval in intervals:
        byte_array += interval.serialize()
    return HttpResponse(bytes(byte_array), content_type='application/octet-stream')


def post_intervals(device: Device, body: bytes) -> HttpResponse:
    """
    Processes intervals sent from STM. Note that STM has to sent intervals along
    with timestamp.
    """

    timestamp_str, intervals_serialized = body.split(b'\n')

    timestamp = int(timestamp_str)
    intervals = Interval.deserialize_intervals(intervals_serialized)
    if intervals is None:
        return HttpResponse(404)

    device.set_intervals(intervals, timestamp)
    return HttpResponse()
