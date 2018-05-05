/**
 * Base class for every device item that could be saved into device.
 */
class ConfigItem {
    constructor(device) {
        this._device = device;
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
