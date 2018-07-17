/**
 * This class represents a list of all devices for one user.
 */
class DeviceList {
    constructor() {
        this._devices = [];
    }

    addDevice(device) {
        if (device instanceof DeviceWindow) {
            this._devices.push(device);
        }
    }

    /**
     * Gets device by ID.
     * @param id ... ID of a device
     * @return {DeviceWindow}
     */
    getDeviceById(id) {
        for (let device of this._devices) {
            if (device.id === id) {
                return device;
            }
        }
    }
}
