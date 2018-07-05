from datetime import datetime
from random import randrange

from stm_comm.models import Device


class KeyManager:
    KEY_TIMEOUT_SECONDS = 4*60

    """
    Dictionary <key, timestamp>. When time is reached, the key is disposed.
    Once in a while this whole dictionary is iterated and all elapsed keys
    are disposed.
    """
    _pending_keys = {}

    @staticmethod
    def generate_key() -> str:
        """
        Generates random key and checks whether it is not used.
        Lifetime of returned key is limited
        """
        key = bytearray()
        for i in range(8):
            key.append(randrange(0, 256))
        key_hex = key.hex()

        if not KeyManager._is_key_used(key_hex):
            KeyManager._add_to_pending_keys(key_hex)
            return key_hex
        else:
            return KeyManager.generate_key()

    @staticmethod
    def get_all_pending_keys() -> [str]:
        KeyManager._remove_expired_keys()
        return KeyManager._pending_keys.keys()

    @staticmethod
    def get_from_pending_keys(key: str) -> str:
        """
        Removes given key from pending keys.
        Removing a key from _pending_keys means that this key will be soon copied
        into some Device ie. this key is now supposed to be "paired" with some
        Device.
        :return:
        """

    @staticmethod
    def _is_key_used(key: str) -> bool:
        for device in Device.objects.all():
            if device.get_key() == key:
                return True
        return False

    @staticmethod
    def _add_to_pending_keys(key: str) -> None:
        if key in KeyManager._pending_keys:
            raise ValueError('Key is not supposed to be in _pending_keys yet')

        KeyManager._pending_keys[key] = KeyManager._get_current_timestamp() + \
                                        KeyManager.KEY_TIMEOUT_SECONDS

    @staticmethod
    def _remove_expired_keys() -> None:
        curr_timestamp = KeyManager._get_current_timestamp()
        for (key, timeout_seconds) in KeyManager._pending_keys.items():
            if timeout_seconds <= curr_timestamp:
                del KeyManager._pending_keys[key]

    @staticmethod
    def _get_current_timestamp() -> int:
        return int(datetime.now().timestamp())
