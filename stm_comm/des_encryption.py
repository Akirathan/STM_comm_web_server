from django.http.request import HttpRequest
import pyDes
from.des_key import DesKey

# Note that all the encryption is done with zero-byte padding and that
# this is sufficient for out purposes, however we need to deal with
# intervals because they are sent/retrieved in binary format
#
# zero-byte padding is OK for string encryption/decryption.


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
