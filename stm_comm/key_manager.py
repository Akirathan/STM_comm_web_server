from datetime import datetime
from random import randrange

from stm_comm.models import Device
from stm_comm.des_key import DesKey


class KeyManager:
    """
    This class creates new DES keys on user's demand and keep them "alive" for
    specific amount of time. It would be insufficient to keep all the generated
    keys alive forever.
    """

    KEY_TIMEOUT_SECONDS = 4*60

    """
    Dictionary <Key, timestamp(int)>. When time is reached, the key is disposed.
    Once in a while this whole dictionary is iterated and all elapsed keys
    are disposed.
    """
    _pending_keys = {}

    @staticmethod
    def generate_key() -> DesKey:
        """
        Generates random key and checks whether it is not used.
        Lifetime of returned key is limited
        """

        key_bytes = bytearray()
        for i in range(8):
            key_bytes.append(randrange(0, 256))
        key = DesKey(bytes(key_bytes))

        if not KeyManager._is_key_used(key):
            KeyManager._add_to_pending_keys(key)
            return key
        else:
            return KeyManager.generate_key()

    @staticmethod
    def get_all_pending_keys() -> [DesKey]:
        """
        Returns all the keys that were generated recently.
        """
        KeyManager._remove_expired_keys()
        return KeyManager._pending_keys.keys()

    @staticmethod
    def remove_from_pending_keys(key: DesKey) -> None:
        """
        Removes given key from pending keys.
        Removing a key from _pending_keys means that this key will be soon copied
        into some Device ie. this key is now supposed to be "paired" with some
        Device.
        :return:
        """
        del KeyManager._pending_keys[key]

    @staticmethod
    def _is_key_used(key: DesKey) -> bool:
        for device in Device.objects.all():
            if device.get_key() == key:
                return True
        for pending_key in KeyManager._pending_keys.keys():
            if pending_key == key:
                return True
        return False

    @staticmethod
    def _add_to_pending_keys(key: DesKey) -> None:
        if key in KeyManager._pending_keys:
            raise ValueError('Key is not supposed to be in _pending_keys yet')

        KeyManager._pending_keys[key] = KeyManager._get_current_timestamp() + \
                                        KeyManager.KEY_TIMEOUT_SECONDS

    @staticmethod
    def _remove_expired_keys() -> None:
        curr_timestamp = KeyManager._get_current_timestamp()
        keys_to_delete = []
        for (key, timeout_seconds) in KeyManager._pending_keys.items():
            if timeout_seconds <= curr_timestamp:
                keys_to_delete.append(key)

        for key_to_delete in keys_to_delete:
            del KeyManager._pending_keys[key_to_delete]

    @staticmethod
    def _get_current_timestamp() -> int:
        return int(datetime.now().timestamp())
