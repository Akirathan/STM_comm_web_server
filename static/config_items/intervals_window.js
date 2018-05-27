/**
 * Represents all intervals for one device ie. list of all intervals
 */
class IntervalsWindow extends ConfigItem {
    static get NOTIFICATION_ID() {return "interval_changed_flag"}
    static get REFRESH_BTN_ID() {return "interval_refresh_button"}
    static get SAVE_INTO_DEVICE_BTN_ID() {return "interval_save_into_device_button"}

    constructor(device) {
        super(device);

        this._tmpValueFromServer = undefined;

        // Find DOM elements
        this._$container = this._findContainer();
        this._$editButtonElem = this._findEditAllButton();
        this._intervalClassElems = this._findIntervalElems(this._$container);
        this._$notificationElem = this._findNotificationJQElem(device.id);
        this._$refreshBtnElem = this._findRefreshBtnJQElem(device.id);
        this._$saveIntoDeviceBtnElem = this._findSaveIntoDeviceBtnJQElem(device.id);

        this._attachEventHandlers();
    }

    /**
     * Returns values of all containing intervals
     * @return {[Interval]}
     */
    getIntervalValues() {
        let array = [];
        for (let intervalWindowElem of this._intervalClassElems) {
            array.push(intervalWindowElem.getValue());
        }
        return array;
    }

    /**
     * Asks every containing interval if there was any change on it.
     * @override
     * @return {boolean}
     */
    isChanged() {
        for (let intervalClass of this._intervalClassElems) {
            if (intervalClass.isChanged()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds and renders new interval inside this._$container (row)
     * @param intervalWindow {IntervalWindow}
     */
    appendIntervalToWindow(intervalWindow) {
        this._intervalClassElems.push(intervalWindow);
        this._$container.append(intervalWindow.getDOMContainer());
    }

    /**
     * Return JSON representation.
     * @return {string}
     */
    toJSON() {
        let jsonStr = "[";
        for (let i = 0; i < this._intervalClassElems.length; i++) {
            let intervalClass = this._intervalClassElems[i];
            jsonStr += intervalClass.toJSON();
            if (i === this._intervalClassElems.length - 1) {
                jsonStr += "]";
            }
            else {
                jsonStr += ",";
            }
        }
        return jsonStr;
    }

    /**
     * Notifies this IntervalsWindow of new intervals value fetched from backend.
     * Enables refresh button and shows notification.
     * @param fetchedIntervals {[Interval]}
     */
    notify(fetchedIntervals) {
        this._tmpValueFromServer = fetchedIntervals;
        this._showChangedNotification();
        this._enableRefreshButton();
    }

    editAll(event) {
        this._switchAllIntervalsToEditable();
        this._switchEditButtonToDoneButton();
        this._$editButtonElem.off("click");
        let _this = this;
        this._$editButtonElem.on("click", function() {_this.doneEditingAll(event);});
    }

    /**
     * TODO: do not refresh whole page
     */
    onRefresh() {
        this._hideSaveIntoDeviceButton();
        this._hideChangedNotification();

        // Reset all containing intervals
        this._removeAllIntervals();
        this._setNewIntervals(this._tmpValueFromServer);
    }

    onSaveIntoDevice() {
        AjaxPoller.setIntervalsForUpload(this._tmpValueFromServer);
        
        this._hideChangedNotification();
        this._switchAllIntervalsToOverview();
        this._disableRefreshButton();
    }

    doneEditingAll(event) {
        this._switchAllIntervalsToOverview();

        this._switchDoneButtonToEditButton();
        this._$editButtonElem.off("click");
        let _this = this;
        this._$editButtonElem.on("click", function () {_this.editAll(event);});

        if (this.isChanged()) {
            this._showSaveIntoDeviceButton();
        }
    }

    _attachEventHandlers() {
        let _this = this;
        this._$editButtonElem.on("click", function() {_this.editAll(event)});
        this._$refreshBtnElem.on("click", function() {_this.onRefresh()});
        this._$saveIntoDeviceBtnElem.on("click", function() {_this.onSaveIntoDevice()});
    }

    _findNotificationJQElem(deviceId) {
        return $("#" + deviceId + "_" + IntervalsWindow.NOTIFICATION_ID);
    }

    _findRefreshBtnJQElem(deviceId) {
        return $("#" + deviceId + "_" + IntervalsWindow.REFRESH_BTN_ID);
    }

    _findSaveIntoDeviceBtnJQElem(deviceId) {
        return $("#" + deviceId + "_" + IntervalsWindow.SAVE_INTO_DEVICE_BTN_ID);
    }


    /**
     * Finds container in which all the intervals are contained.
     * @note all interval containers should have id in this form: "<devID>_interval"
     * @private
     */
    _findContainer() {
        return $("#" + this._device.id + "_interval");
    }

    _findEditAllButton() {
        return $("#" + this._device.id + "_interval_editall_button");
    }

    /**
     *
     * @param $container
     * @return {Array}
     * @private
     */
    _findIntervalElems($container) {
        let intervalElems = [];
        let children = $container.children();
        for (let child of children) {
            let intervalElem = $(child).find(".interval")[0];
            let $intervalElem = $(intervalElem);
            intervalElems.push(new IntervalWindow($intervalElem));
        }
        return intervalElems;
    }

    _switchEditButtonToDoneButton() {
        this._$editButtonElem.html("Done");
    }

    _switchDoneButtonToEditButton() {
        this._$editButtonElem.html("Edit");
    }

    _switchAllIntervalsToOverview() {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showOverviewInterval();
        }
    }

    _switchAllIntervalsToEditable() {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showEditableInterval();
        }

    }

    _showChangedNotification() {
        this._$notificationElem.show();
    }

    _hideChangedNotification() {
        this._$notificationElem.hide();
    }

    _enableRefreshButton() {
        this._$refreshBtnElem.attr("disabled", "false");
    }

    _disableRefreshButton() {

    }

    _showSaveIntoDeviceButton() {
        this._$saveIntoDeviceBtnElem.show();
    }

    _hideSaveIntoDeviceButton() {
        this._$saveIntoDeviceBtnElem.hide();
    }

    /**
     * Removes all intervals (_intervalClassElems) that are contained in this
     * IntervalsWindow from DOM.
     * @private
     */
    _removeAllIntervals() {
        let container = this._$container.get()[0];
        for (let intervalWindow of this._intervalClassElems) {
            container.removeChild(intervalWindow.getDOMContainer());
        }

        this._intervalClassElems = [];
    }

    /**
     * Sets new intervals to the DOM.
     * @param intervals {[Interval]}
     * @private
     */
    _setNewIntervals(intervals) {
        let deviceId = this._device.id;
        for (let i = 0; i < intervals.length; i++) {
            let intervalWindow = IntervalTemplate.renderNewIntervalWindow(deviceId, i, intervals[i]);
            this.appendIntervalToWindow(intervalWindow);
        }
    }
}
