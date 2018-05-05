class Device {
    static get BTN_GROUP_ID() { return "btngroup";}
    static get SAVE_INTO_DEVICE_BTN_ID() { return "btngroup_saveintodevice";}
    static get DISCARD_CHANGES_BTN_ID() { return "btngroup_discardchanges";}
    static get SAVED_SUCCESS_TEXT_ID() {return "save_success_text";}
    static get SAVED_ERROR_TEXT_ID() {return "save_error_text";}
    static get SAVE_INTO_DEVICE_BTN_LOADER_ID() {return "save_button_loader_icon";}

    constructor(deviceId) {
        this._deviceId = deviceId;
        this._configItems = [];
        this._$btnGroupElem = this._findButtonGroupJQElem(deviceId);
        this._$saveIntoDeviceButtonElem = this._findSaveIntoDeviceButtonJQElem(deviceId);
        this._$discardChangesButtonElem = this._findDiscardChangesButtonJQElem(deviceId);
        this._$saveButtonLoaderIconElem = this._findSaveButtonLoaderIconJQElem(deviceId);
        this._$saveSuccessTextElem = this._findSaveSuccessTextJQElem(deviceId);
        this._$saveErrorTextElem = this._findSaveErrorTextJQElem(deviceId);

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

    _findSaveSuccessTextJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.SAVED_SUCCESS_TEXT_ID);
    }

    _findSaveErrorTextJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.SAVED_ERROR_TEXT_ID);
    }

    _findSaveButtonLoaderIconJQElem(deviceId) {
        return $("#" + deviceId + "_" + Device.SAVE_INTO_DEVICE_BTN_LOADER_ID);
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
        var csrftoken = Device._getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!Device._csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
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
        Device._ensureCsrf();

        for (let configItem of this._configItems) {
            if (configItem.isChanged()) {
                configItem.saveIntoDevice();
            }
        }
    }

    onDiscardChanges() {

    }

    static onSaveIntoDevice(event) {

    }
}