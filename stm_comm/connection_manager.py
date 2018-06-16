from django.http import HttpRequest


class ConnectionManager:
    # Map device_id <-> remote_address (client's IP address)
    connected_devices = {}

    @staticmethod
    def add_device(device_id: str, remote_addr: str):
        if device_id in ConnectionManager.connected_devices:
            return
        ConnectionManager.connected_devices[device_id] = remote_addr
        print('ConnectionManager: device with id=' + device_id + ' connected at remote_addr=' + remote_addr)
        return

    @staticmethod
    def get_device_id_from_request(request: HttpRequest) -> str:
        return ConnectionManager.__get_device_id__(request.META['REMOTE_ADDR'])

    @staticmethod
    def __get_device_id__(remote_addr: str) -> str:
        for (device_id_item, remote_addr_item) in ConnectionManager.connected_devices.items():
            if remote_addr_item == remote_addr:
                return device_id_item
