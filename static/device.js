class Device {
    static get BTN_GROUP_ID() { return "btngroup";}
    static get SAVE_INTO_DEVICE_BTN_ID() { return "btngroup_saveintodevice";}
    static get DISCARD_CHANGES_BTN_ID() { return "btngroup_discardchanges";}

    constructor(deviceId) {
        this._deviceId = deviceId;
        this._configItems = [];
        this._$btnGroupElem = this._findButtonGroupJQElem(deviceId);
        this._$saveIntoDeviceButtonElem = this._findSaveIntoDeviceButtonJQElem(deviceId);
        this._$discardChangesButtonElem = this._findDiscardChangesButtonJQElem(deviceId);

        this._attachEventHandlers();
    }

    _attachEventHandlers() {
        let _this = this;
        this._$saveIntoDeviceButtonElem.on("click", function(){_this.onSaveIntoDevice();});
        this._$discardChangesButtonElem.on("click", function(){_this.onDiscardChanges();});
    }

    _findButtonGroupJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.BTN_GROUP_ID);
    }

    _findSaveIntoDeviceButtonJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.SAVE_INTO_DEVICE_BTN_ID);
    }

    _findDiscardChangesButtonJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.DISCARD_CHANGES_BTN_ID);
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
     * Shows "Save into device" and "Discard changes" buttons.
     */
    showSaveIntoDeviceButtonGroup() {
        this._$btnGroupElem.show();
    }

    /**
     * Saves every config item into device.
     */
    onSaveIntoDevice() {
        for (let configItem of this._configItems) {
            if (configItem.isChanged()) {
                configItem.onSaveIntoDevice();
            }
        }
    }

    onDiscardChanges() {

    }

    static onSaveIntoDevice(event) {

    }
}