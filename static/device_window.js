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
     */
    notifyIntervals(intervals) {
        for (let configItem of this._configItems) {
            if (configItem instanceof IntervalsWindow) {
                configItem.notify(intervals);
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