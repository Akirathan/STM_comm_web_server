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
     * @param id
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
