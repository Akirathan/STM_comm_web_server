/**
 * Represents all intervals for one device ie. list of all intervals
 */
class IntervalsWindow extends ConfigItem {
    static get NOTIFICATION_ID() {return "interval_changed_flag"}
    static get REFRESH_BTN_ID() {return "interval_refresh_button"}

    constructor(device) {
        super(device);

        this._tmpValueFromServer = undefined;

        // Find DOM elements
        this._$container = this._findContainer();
        this._$editButtonElem = this._findEditAllButton();
        this._intervalClassElems = this._findIntervalElems(this._$container);
        this._$notificationElem = this._findNotificationJQElem(device.id);
        this._$refreshBtnElem = this._findRefreshBtnJQElem(device.id);

        this._attachEventHandlers();
    }

    _attachEventHandlers() {
        let _this = this;
        this._$editButtonElem.on("click", function() {_this.editAll(event)});
        this._$refreshBtnElem.on("click", function() {_this.onRefresh()});
    }

    _findNotificationJQElem(deviceId) {
        return $("#" + deviceId + "_" + IntervalsWindow.NOTIFICATION_ID);
    }

    _findRefreshBtnJQElem(deviceId) {
        return $("#" + deviceId + "_" + IntervalsWindow.REFRESH_BTN_ID);
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

    editAll(event) {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showEditableInterval();
        }
        
        this._$editButtonElem.html("Done");
        this._$editButtonElem.off("click");
        let _this = this;
        this._$editButtonElem.on("click", function() {_this.doneEditingAll(event);});
    }

    onRefresh() {

    }

    doneEditingAll(event) {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showOverviewInterval();
        }

        this._$editButtonElem.html("Edit");
        this._$editButtonElem.off("click");
        let _this = this;
        this._$editButtonElem.on("click", function () {_this.editAll(event);});

        if (this.isChanged()) {
            this._device.showSaveIntoDeviceButtonGroup();
        }
    }
}
