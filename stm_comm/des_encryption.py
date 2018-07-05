from django.http.request import HttpRequest
import pyDes
from.des_key import DesKey


def decrypt_req_body(request: HttpRequest, key: DesKey) -> str:
    des_obj = pyDes.des(key.bytes, mode=pyDes.ECB, pad='\0', padmode=pyDes.PAD_NORMAL)
    return des_obj.decrypt(request.body)


def encrypt_response_body(key: DesKey, body) -> bytes:
    des_obj = pyDes.des(key.bytes, mode=pyDes.ECB, pad='\0', padmode=pyDes.PAD_NORMAL)
    if type(body) != bytes:
        body = bytes(body)
    return des_obj.encrypt(body)
