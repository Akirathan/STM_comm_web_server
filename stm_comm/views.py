from datetime import datetime
from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .connection_manager import ConnectionManager
from .models import Device
from .key_manager import KeyManager
from .des_encryption import decrypt_req_body, encrypt_response_body


def parse_update_temp_req(body_str: str) -> (int, float):
    """
    Parses "POST temperature request" from device.
    :return: (timestamp, temperature)
    """
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

    (timestamp, temp) = parse_update_temp_req(decrypt_req_body(request, device.get_key()))
    device.set_temperature(timestamp, temp)

    return HttpResponse()


@csrf_exempt
def connect(request: HttpRequest) -> HttpResponse:
    """ First message from STM device """
    if request.method != 'POST':
        return HttpResponse(status=400)

    # Check if the device is in the device database
    device = _assign_key_from_connect_request(request)
    device.set_online()

    ConnectionManager.add_device(device.device_id, request.META['REMOTE_ADDR'])

    response_body = int(datetime.now().timestamp())
    return HttpResponse(encrypt_response_body(response_body))


def _is_device_id(s: str) -> bool:
    for device in Device.objects.all():
        if device.device_id == s:
            return True
    return False


def _assign_key_from_connect_request(request: HttpRequest) -> Device:
    """
    Tries to decrypt connect message with every pending DesKey. Once the decrypted
    body is equal to any existing device's ID, the key used for decryption is assigned
    to that device.
    :return Device to which a key was assigned or None.
    """
    for key in KeyManager.get_all_pending_keys():
        decrypted_body = decrypt_req_body(request, key)
        decrypted_body_str = str(decrypted_body, 'ascii')
        if _is_device_id(decrypted_body_str):
            device = Device.objects.get(device_id=decrypted_body_str)
            KeyManager.remove_from_pending_keys(key)
            device.set_key(key)
            return device
    return None
