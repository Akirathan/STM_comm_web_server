from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
import struct
from .connection_manager import ConnectionManager
from .models import Device, Interval
from .des_encryption import encrypt_response_body, decrypt_req_body


@csrf_exempt
def get_intervals_timestamp(request: HttpRequest) -> HttpResponse:
    """
    Processes "GET intervals/timestamp" message from STM.
    :return: timestamp in string format
    """

    if request.method != 'GET':
        return HttpResponse(404)

    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(404)

    response_body = str(device.get_intervals_timestamp())
    return HttpResponse(encrypt_response_body(device.get_key(), response_body))


@csrf_exempt
def get_or_post_intervals(request: HttpRequest) -> HttpResponse:
    device = ConnectionManager.get_device_from_request(request)
    if device is None:
        return HttpResponse(404)

    if request.method == 'GET':
        return get_intervals(device)
    if request.method == 'POST':
        decrypted_body = decrypt_req_body(request, device.get_key())
        return post_intervals(device, decrypted_body)


def get_intervals(device: Device) -> HttpResponse:
    """
    Returns just serialized intervals, there is no need to add timestamp,
    STM already has it.
    """
    byte_array = bytearray()
    intervals = device.get_intervals()
    for interval in intervals:
        byte_array += interval.serialize()
    encrypted_body = encrypt_response_body(device.get_key(), bytes(byte_array))
    return HttpResponse(encrypted_body, content_type='application/octet-stream')


def post_intervals(device: Device, decrypted_body: bytes) -> HttpResponse:
    """
    Processes intervals sent from STM. Note that STM has to sent intervals along
    with timestamp.
    """
    timestamp = struct.unpack('I', decrypted_body[:4])[0]
    intervals_decrypted = decrypted_body[4:]
    
    intervals_fixed_padding = _fill_removed_zeros(intervals_decrypted)
    intervals = Interval.deserialize_intervals(intervals_fixed_padding)
    if intervals is None:
        return HttpResponse(404)

    device.set_intervals(intervals, timestamp)
    return HttpResponse()


def _fill_removed_zeros(decrypted_body: bytes) -> bytes:
    """
    Note that this function is necessary because pyDes does remove all trailing
    zero bytes and that is incorrect for intervals messages.
    :param decrypted_body: Body with removed trailing zeroes
    :return:
    """
    if decrypted_body[len(decrypted_body) - 1] == 0:
        raise ValueError('Not all trailing zeroes removed')

    filled_body = bytearray(decrypted_body)
    i = len(decrypted_body)
    while (i % 12) != 0:
        filled_body.append(0)
        i += 1
    return bytes(filled_body)

