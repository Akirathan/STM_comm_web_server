class Device {
    static get BTN_GROUP_ID() { return "btngroup";}
    static get SAVE_INTO_DEVICE_BTN_ID() { return "btngroup_saveintodevice";}
    static get DISCARD_CHANGES_BTN_ID() { return "btngroup_discardchanges";}

    constructor(deviceId) {
        this._deviceId = deviceId;
        this._configItems = [];
    }

    get id() {
        return this._deviceId;
    }

    addConfigItem(configItem) {
        if (configItem instanceof ConfigItem) {
            this._configItems.push(configItem);
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