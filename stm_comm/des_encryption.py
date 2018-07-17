from django.http.request import HttpRequest
import pyDes
from.des_key import DesKey


def decrypt_req_body(request: HttpRequest, key: DesKey) -> bytes:
    des_obj = pyDes.des(key.bytes, mode=pyDes.ECB, pad='\0', padmode=pyDes.PAD_NORMAL)
    return des_obj.decrypt(request.body)


def encrypt_response_body(key: DesKey, body) -> bytes:
    if type(body) == str:
        body = bytes(body, 'ascii')
    elif type(body) == bytes:
        pass
    else:
        raise ValueError('Unsupported parameter type')

    des_obj = pyDes.des(key.bytes, mode=pyDes.ECB, pad='\0', padmode=pyDes.PAD_NORMAL)
    return des_obj.encrypt(body)
