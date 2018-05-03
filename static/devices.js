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

    }
}

class Device {
   constructor(deviceId) {
        this._deviceId = deviceId;
        this._configItems = [];
    }

    get id() {
        return this._deviceId;
    }

    static getDeviceIdFromElement(element) {

    }

    addConfigItem(configItem) {
        if (configItem instanceof ConfigItem) {
            this._configItems.push(configItem);
        }
    }

    /**
     * @param element
     * @return {ConfigItem}
     */
    getConfigItemFromElement(element) {
       for (let configItem of this._configItems) {
           if (configItem.containsElement(element)) {
               return configItem;
           }
       }
    }

    /**
     * Saves every config item into device.
     */
    saveIntoDevice() {
        for (let configItem of this._configItems) {
            if (configItem.isChanged()) {
                configItem.saveIntoDevice();
            }
        }
    }

    static onSaveIntoDevice(event) {

    }
}