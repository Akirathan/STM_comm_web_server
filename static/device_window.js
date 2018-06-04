class DeviceWindow {
    // temperature of this device
    static get TEMPERATURE_VALUE_ID() {return "temp";}
    // Asterisk with tooltip nearby temperature (notification).
    static get TEMPERATURE_NOTIFY_ID() {return "temp_changed_flag";}
    static get TEMPERATURE_REFRESH_BTN_ID() {return "temp_refresh_button";}
    // online/offline status of the device
    static get STATE_VALUE_ID() {return "state";}

    constructor(deviceId) {
        this._deviceId = deviceId;
        this._configItems = [];
        // Temperature value fetched by AjaxPoller
        this._newTempValue = 0.0;
        this._$temperatureValueElem = this._findTemperatureJQElem(deviceId);
        this._$temperatureNotificationElem = this._findTemperatureNotificationJQElem(deviceId);
        this._$temperatureRefreshBtnElem = this._findTemperatureRefreshBtnJQElem(deviceId);
        this._$stateValueElem = this._findStateJQElem(deviceId);

        this._attachEventHandlers();
    }

    get id() {
        return this._deviceId;
    }

    /**
     * @return {IntervalsWindow}
     */
    get intervalsWindow() {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                return configItem;
            }
        }
    }

    getTemperature() {
        return this._$temperatureValueElem.html()
    }

    /**
     * Return "online" or "offline"
     */
    getState() {
        return this._$stateValueElem.html();
    }

    /**
     * Returns timestamp from the time when user finished editing intervals ie.
     * pressed Done button.
     * @return {int}
     */
    getIntervalsDoneEditingTimestamp() {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                return configItem.getDoneEditingTimestamp();
            }
        }
    }

    /**
     * @return {[Interval]}
     */
    getIntervals() {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                return configItem.getIntervalValues();
            }
        }
        return [];
    }

    /**
     * @return {[Interval]}
     */
    getIntervalsBeforeEditing() {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                return configItem.getIntervalValuesBeforeEditing();
            }
        }
    }

    /**
     * Notifies this Device of new temperature value fetched from backend.
     * Shows notification and enables refresh button.
     * @param temp {float}
     */
    notifyTemperature(temp) {
        this._$temperatureNotificationElem.show();
        this._$temperatureRefreshBtnElem.removeAttr("disabled");
        this._newTempValue = temp;
    }

    /**
     * Notifies this Device of new intervals values fetched from backend.
     * @param intervals {[Interval]}
     * @param timestamp {int}
     */
    notifyIntervalsWithTimestamp(intervals, timestamp) {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                configItem.notifyWithTimestamp(intervals, timestamp);
            }
        }
    }

    /**
     * Called from AjaxPoller when intervals are successfully POSTed into server.
     * Dispatches the call to IntervalsWindow
     */
    intervalsUploaded() {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                configItem.savedIntoDevice();
            }
        }
    }

    /**
     * Changes state of this device immediately.
     * @param {string} state online or offline
     */
    changeState(state) {
        // TODO: display some animation
        if (state === "online" || state === "offline") {
            this._$stateValueElem.html(state);
        }
    }

    addConfigItem(configItem) {
        if (configItem instanceof ConfigItem) {
            this._configItems.push(configItem);
        }
    }

    onTemperatureRefresh() {
        this._$temperatureNotificationElem.hide();
        this._$temperatureRefreshBtnElem.attr("disabled", "true");
        this._$temperatureValueElem.html(this._newTempValue);
    }


    _attachEventHandlers() {
        let _this = this;
        this._$temperatureRefreshBtnElem.on("click", function(){_this.onTemperatureRefresh()})
    }

    _findTemperatureJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.TEMPERATURE_VALUE_ID);
    }

    /**
     * Finds temperature asterisk (notification) element.
     */
    _findTemperatureNotificationJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.TEMPERATURE_NOTIFY_ID);
    }

    _findTemperatureRefreshBtnJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.TEMPERATURE_REFRESH_BTN_ID);
    }

    _findStateJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.STATE_VALUE_ID);
    }
}