
class DesKey:
    """ Wrapper for DES key """
    KEY_LEN = 8

    def __init__(self, value):
        if type(value) == str:
            if len(value) != DesKey.KEY_LEN * 2:
                raise ValueError('Wrong key length')
            self._hex_str_value = value
            self._bytes_value = bytes.fromhex(value)
        elif type(value) == bytes:
            if len(value) != DesKey.KEY_LEN:
                raise ValueError('Wrong key length')
            self._bytes_value = value
            self._hex_str_value = value.hex()
        else:
            raise ValueError('Unsupported type')

    @property
    def hex_str(self) -> str:
        return self._hex_str_value

    @property
    def bytes(self) -> bytes:
        return self._bytes_value
