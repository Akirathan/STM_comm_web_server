class DeviceWindow {
    static get BTN_GROUP_ID() { return "btngroup";}
    static get SAVE_INTO_DEVICE_BTN_ID() { return "btngroup_saveintodevice";}
    static get DISCARD_CHANGES_BTN_ID() { return "btngroup_discardchanges";}
    static get SAVED_SUCCESS_TEXT_ID() {return "save_success_text";}
    static get SAVED_ERROR_TEXT_ID() {return "save_error_text";}
    static get SAVE_INTO_DEVICE_BTN_LOADER_ID() {return "save_button_loader_icon";}
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
        this._$btnGroupElem = this._findButtonGroupJQElem(deviceId);
        this._$saveIntoDeviceButtonElem = this._findSaveIntoDeviceButtonJQElem(deviceId);
        this._$discardChangesButtonElem = this._findDiscardChangesButtonJQElem(deviceId);
        this._$saveButtonLoaderIconElem = this._findSaveButtonLoaderIconJQElem(deviceId);
        this._$saveSuccessTextElem = this._findSaveSuccessTextJQElem(deviceId);
        this._$saveErrorTextElem = this._findSaveErrorTextJQElem(deviceId);
        this._$temperatureValueElem = this._findTemperatureJQElem(deviceId);
        this._$temperatureNotificationElem = this._findTemperatureNotificationJQElem(deviceId);
        this._$temperatureRefreshBtnElem = this._findTemperatureRefreshBtnJQElem(devideId);
        this._$stateValueElem = this._findStateJQElem(deviceId);

        this._attachEventHandlers();
    }

    _attachEventHandlers() {
        let _this = this;
        this._$saveIntoDeviceButtonElem.on("click", function(){_this.onSaveIntoDevice();});
        this._$discardChangesButtonElem.on("click", function(){_this.onDiscardChanges();});
        this._$temperatureRefreshBtnElem.on("click", function(){_this.onTemperatureRefresh()})
    }

    _findButtonGroupJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.BTN_GROUP_ID);
    }

    _findSaveIntoDeviceButtonJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.SAVE_INTO_DEVICE_BTN_ID);
    }

    _findDiscardChangesButtonJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.DISCARD_CHANGES_BTN_ID);
    }

    _findSaveSuccessTextJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.SAVED_SUCCESS_TEXT_ID);
    }

    _findSaveErrorTextJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.SAVED_ERROR_TEXT_ID);
    }

    _findSaveButtonLoaderIconJQElem(deviceId) {
        return $("#" + deviceId + "_" + DeviceWindow.SAVE_INTO_DEVICE_BTN_LOADER_ID);
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


    static _getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    static _csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    static _ensureCsrf() {
        var csrftoken = DeviceWindow._getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!DeviceWindow._csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    }

    get id() {
        return this._deviceId;
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
     * Notifies this Device of new temperature value fetched from backend.
     * Shows notification and enables refresh button.
     * @param temp {float}
     */
    notifyTemperature(temp) {
        this._$temperatureNotificationElem.show();
        this._$temperatureRefreshBtnElem.attr("disabled", "false");
        this._newTempValue = temp;
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

    /**
     * Shows "Save into device" and "Discard changes" buttons.
     */
    showSaveIntoDeviceButtonGroup() {
        this._$btnGroupElem.show();
    }

    saveIntoDeviceDone() {
        this._$saveButtonLoaderIconElem.hide();
        this._$btnGroupElem.hide();

        this._$saveSuccessTextElem.show();
    }

    saveIntoDeviceProgress() {
        this._$saveButtonLoaderIconElem.show();
    }

    saveIntoDeviceError() {
        this._$saveButtonLoaderIconElem.hide();
        this._$btnGroupElem.hide();

        this._$saveErrorTextElem.show();
    }

    /**
     * Saves every config item into device.
     */
    onSaveIntoDevice() {
        DeviceWindow._ensureCsrf();

        for (let configItem of this._configItems) {
            if (configItem.isChanged()) {
                configItem.saveIntoDevice();
            }
        }
    }

    onDiscardChanges() {

    }

    onTemperatureRefresh() {
        this._$temperatureNotificationElem.hide();
        this._$temperatureRefreshBtnElem.attr("disabled", "true");
        this._$temperatureValueElem.html(this._newTempValue);
    }

    static onSaveIntoDevice(event) {

    }
}