class DeviceList {
    constructor() {
        this._devices = [];
    }

    addDevice(device) {
        if (device instanceof Device) {
            this._devices.push(device);
        }
    }

    /**
     * @param id
     * @return {Device}
     */
    getDeviceById(id) {
        for (let device of this._devices) {
            if (device.id === id) {
                return device;
            }
        }
    }
}
