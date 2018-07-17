from datetime import datetime
from django.http import HttpRequest
from .models import Device


class ConnectionManager:
    """
    This class keeps track of every connected STM - it maps device_id to IP address.
    After a long time of inactivity, the device is considered to be offline, this is
    checked in get_device_from_request and also in add_device.
    """

    # device_id:str <-> (remote_address:str, timeout:int)
    _connected_devices = {}
    CONNECTION_TIMEOUT_SECS = 10

    @staticmethod
    def add_device(device_id: str, remote_addr: str):
        """
        Adds given device to the list of connected devices. This device will be
        considered online as long as it will periodically send some messages.
        :param device_id: ID of the device
        :param remote_addr: IP address of the device
        :return:
        """
        ConnectionManager._check_and_remove_offline_devices()

        if device_id in ConnectionManager._connected_devices:
            return
        ConnectionManager._connected_devices[device_id] = \
            (remote_addr, ConnectionManager._get_curr_timestamp() + ConnectionManager.CONNECTION_TIMEOUT_SECS)
        print('ConnectionManager: device with id=' + device_id + ' connected at remote_addr=' + remote_addr)
        return

    @staticmethod
    def get_device_from_request(request: HttpRequest) -> 'Device':
        """
        Gets device from the source IP of the given request. Also refreshes the device
        offline timeout.
        :param request:
        :return:
        """
        device_id = ConnectionManager._get_device_id(request.META['REMOTE_ADDR'])

        ConnectionManager._refresh_offline_timeout(device_id)
        ConnectionManager._check_and_remove_offline_devices()

        return Device.objects.get(device_id=device_id)

    @staticmethod
    def check_timeouts() -> None:
        """
        Check the timeout of "offline device timeout timer".
        """
        ConnectionManager._check_and_remove_offline_devices()

    @staticmethod
    def _get_device_id(remote_addr: str) -> str:
        for (device_id_item, (remote_addr_item, timeout)) in ConnectionManager._connected_devices.items():
            if remote_addr_item == remote_addr:
                return device_id_item

    @staticmethod
    def _get_curr_timestamp() -> int:
        return int(datetime.now().timestamp())

    @staticmethod
    def _refresh_offline_timeout(device_id: str) -> None:
        (remote_addr, timeout) = ConnectionManager._connected_devices[device_id]
        timeout = ConnectionManager._get_curr_timestamp() + ConnectionManager.CONNECTION_TIMEOUT_SECS
        ConnectionManager._connected_devices[device_id] = (remote_addr, timeout)

    @staticmethod
    def _check_and_remove_offline_devices() -> None:
        """ Removes offline devices from _connected_devices and also sets them offline in DB """
        device_ids_to_remove = []
        for (device_id, (remote_addr, timeout)) in ConnectionManager._connected_devices.items():
            if ConnectionManager._get_curr_timestamp() >= timeout:
                device_ids_to_remove.append(device_id)

        for device_id in device_ids_to_remove:
            ConnectionManager._set_offline(device_id)
            del ConnectionManager._connected_devices[device_id]

    @staticmethod
    def _set_offline(device_id: str) -> None:
        device = Device.objects.get(device_id=device_id)
        device.set_offline()
