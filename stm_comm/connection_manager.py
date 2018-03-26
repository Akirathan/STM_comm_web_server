
class ConnectionManager:
    connected_devices = {}

    @staticmethod
    def add_device(device_id: str, host: str, port: str):
        if device_id in ConnectionManager.connected_devices:
            return
        ConnectionManager.connected_devices[device_id] = (host, port)
        return

    @staticmethod
    def get_device_id(host: str, port: str) -> str:
        return

