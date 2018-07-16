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

    decrypted_body = decrypt_req_body(request, device.get_key())
    (timestamp, temp) = parse_update_temp_req(str(decrypted_body, 'ascii'))
    device.set_temperature(timestamp, temp)

    return HttpResponse()


@csrf_exempt
def connect(request: HttpRequest) -> HttpResponse:
    """
    Processes first message from STM device that is currently offline.
    All pending keys from KeyManager that were recently generated are tried for
    decryption of request's body, until the decrypted body is equal to some
    device's ID. Also all keys from offline Devices (that are already paired)
    are tried.
    Note that the possibility that two different keys will decrypt the message's
    body into two different IDs is very small.
    """
    if request.method != 'POST':
        return HttpResponse(status=404)

    ConnectionManager.check_timeouts()

    device = _try_decrypt_connect_req(request)
    if device is None:
        return HttpResponse(status=404)

    device.set_online()

    ConnectionManager.add_device(device.device_id, request.META['REMOTE_ADDR'])

    response_body = str(int(datetime.now().timestamp()))
    return HttpResponse(encrypt_response_body(device.get_key(), response_body))


def _is_device_id(s: str) -> bool:
    for device in Device.objects.all():
        if device.device_id == s:
            return True
    return False


def _try_decrypt_connect_req(request: HttpRequest) -> Device:
    """
    Tries to decrypt connect message with every pending DesKey and every key
    in offline devices. Once the decrypted body is equal to any existing
    device's ID, the key used for decryption is assigned to that device.
    :return Device to which a key was assigned or None.
    """
    # Try all pending keys from KeyManager first.
    for key in KeyManager.get_all_pending_keys():
        decrypted_body = decrypt_req_body(request, key)
        decrypted_body_str = str(decrypted_body, 'ascii')
        if _is_device_id(decrypted_body_str):
            device = Device.objects.get(device_id=decrypted_body_str)
            KeyManager.remove_from_pending_keys(key)
            device.set_key(key)
            return device

    # Try keys from all offline devices
    for offline_device in Device.get_offline_devices():
        if offline_device.get_key() is None:
            continue
        decrypted_body = decrypt_req_body(request, offline_device.get_key())
        decrypted_body_str = str(decrypted_body, 'ascii')
        if decrypted_body_str == offline_device.device_id:
            return offline_device

    return None

