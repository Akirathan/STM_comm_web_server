/**
 * Base class for every device item that could be saved into device.
 */
class ConfigItem {
    constructor(deviceId) {
        this._domContainerId = deviceId;
    }

    /**
     * Device calls this method when it tries to locate corresponding config_item
     * @abstract
     * @param element
     * @return {boolean}
     */
    containsElement(element) {
        return false;
    }

    /**
     * Send AJAX request to backend. The value is then saved into db and sent to device.
     * @abstract
     */
    saveIntoDevice(){}

    /**
     * Check whether user changed values of this config item.
     * @abstract
     * @return {boolean}
     */
    isChanged() {
        return false;
    }
}
