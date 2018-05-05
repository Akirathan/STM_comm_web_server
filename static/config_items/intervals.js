/**
 * Represents all intervals for one device ie. list of all intervals
 */
class Intervals extends ConfigItem {
    static get SAVE_INTO_DEVICE_URL() {return "intervals";}

    constructor(device) {
        super(device);
        this._$container = this._findContainer();
        this._$editButtonElem = this._findEditAllButton();
        this._intervalClassElems = this._findIntervalElems(this._$container);

        this._attachEventHandlers();
    }

    _attachEventHandlers() {
        let _this = this;
        this._$editButtonElem.on("click", function() {
            _this.editAll(event);
        });
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

    saveIntoDevice() {
        let dataStr = `{"device_id":"${this._device.id}","intervals":${this.toJSON()}}`;
        let _this = this;

        $.ajax({
            url: Intervals.SAVE_INTO_DEVICE_URL,
            data: dataStr,
            contentType: "application/json",
            method: "POST",
            success: function (data, textStatus, jqXHR) {
                _this._device.saveIntoDeviceDone();
            },
            error: function (data, textStatus, jqXHR) {
                _this._device.saveIntoDeviceError();
            }
        });

        _this._device.saveIntoDeviceProgress();
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
            intervalElems.push(new Interval($intervalElem));
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
