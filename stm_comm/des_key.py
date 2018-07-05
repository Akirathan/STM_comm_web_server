
class DesKey:
    def __init__(self, value):
        if type(value) == str:
            self._hex_str_value = value
            self._bytes_value = bytes.fromhex(value)
        elif type(value) == bytes:
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
