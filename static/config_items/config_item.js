/**
 * Base class for every device item that could be saved into device.
 */
class ConfigItem {
    constructor(deviceId) {
        this._domContainerId = deviceId;
    }

    /**
     * Send AJAX request to backend. The value is then saved into db and sent to device.
     */
    saveIntoDevice(){}

    /**
     * Check whether user changed values of this config item.
     * @return {boolean}
     */
    isChanged() {
        return false;
    }
}