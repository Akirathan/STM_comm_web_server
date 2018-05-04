/**
 * Represents all intervals for one device ie. list of all intervals
 */
class Intervals extends ConfigItem {
    constructor(deviceId) {
        super(deviceId);
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

    isChanged() {
        // ...
    }

    saveIntoDevice() {
        // Send intervals AJAX
        // ...
    }

    containsElement(element) {

    }

    /**
     * Finds container in which all the intervals are contained.
     * @note all interval containers should have id in this form: "<devID>_interval"
     * @private
     */
    _findContainer() {
        return $("#" + this._domContainerId + "_interval");
    }

    _findEditAllButton() {
        return $("#" + this._domContainerId + "_interval_editall_button");
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

    /**
     * Finds corresponding IntervalType from event (element)
     * @param element
     * @private
     * @return {Interval}
     */
    static _getIntervalsFromElement(element) {
        let deviceId = Device.getDeviceIdFromElement(element);
        let device = deviceList.getDeviceById(deviceId);
        let configItem = device.getConfigItemFromElement(element);
        if (!configItem instanceof Intervals) {
            // Error: ...
        }

        return configItem;
    }

    editAll(event) {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showEditableInterval();
        }
        
        this._$editButtonElem.html("Done");
        this._$editButtonElem.off("click");
        this._$editButtonElem.on("click", this.doneEditingAll);
    }

    doneEditingAll(event) {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showOverviewInterval();
        }

        this._$editButtonElem.html("Edit");
        this._$editButtonElem.off("click");
        this._$editButtonElem.on("click", this.editAll);

        // if intervals changed, show "Save into device" button.
        // todo: ...
    }
}

/**
 * Represents both overview and editable interval.
 */
class Interval {
    constructor($intervalElement) {
        this._$overviewIntervalElem = $intervalElement;
        this._$editableIntervalElem = this._findEditableIntervalElem($intervalElement.get()[0]);
        this._fromTimeElem = this._findFromTimeElem($intervalElement);
        this._toTimeElem = this._findToTimeElem($intervalElement);
        this._tempElem = this._findTempElem($intervalElement);
        this._editableFromTimeElem = this._findEditableFromTimeElem(this._$editableIntervalElem);
        this._editableToTimeElem = this._findEditableToTimeElem(this._$editableIntervalElem);
        this._editableTempElem = this._findEditableTempElem(this._$editableIntervalElem);
        this._deleteButton = this._findDeleteButtonElem(this._$editableIntervalElem);

        this._attachEventHandlers();
    }

    _attachEventHandlers() {
        $(this._editableFromTimeElem).on("click", this.onChangeFromTime);
        $(this._editableToTimeElem).on("click", this.onChangeToTime);
        $(this._editableTempElem).on("click", this.onChangeTemp);
        $(this._deleteButton).on("click", this.onDelete);
    }

    _findEditableIntervalElem(intervalElement) {
        let parentElement = intervalElement.parentElement;
        for (let child of parentElement.children) {
            if (child.id.search("editable") !== -1) {
                return $(child);
            }
        }
    }

    _findFromTimeElem($intervalElement) {
        return $intervalElement.find(".from")[0];
    }

    _findToTimeElem($intervalElement) {
        return $intervalElement.find(".to")[0];
    }

    _findTempElem($intervalElement) {
        return $intervalElement.find(".temp")[0];
    }

    _findChildContainingId($editableIntervalElem, partOfId) {
        return $editableIntervalElem.find("*").filter(function(index, element) {
            return element.id.search(partOfId) > -1;
        })[0];
    }

    _findEditableFromTimeElem($editableIntervalElem) {
        return this._findChildContainingId($editableIntervalElem, "from");
    }

    _findEditableToTimeElem($editableIntervalElem) {
        return this._findChildContainingId($editableIntervalElem, "to");
    }

    _findEditableTempElem($editableIntervalElem) {
        return this._findChildContainingId($editableIntervalElem, "temp");
    }

    _findDeleteButtonElem($editableIntervalElem) {
        return this._findChildContainingId($editableIntervalElem, "deletebutton");
    }

    onChangeFromTime(event) {
        this._fromTimeElem.html = event.target.value;
    }

    onChangeToTime(event) {
        this._toTimeElem.html = event.target.value;
    }

    onChangeTemp(event) {
        this._tempElem.html = event.target.value;
    }

    /**
     * Hides this interval (sets display:none)
     */
    onDelete(event) {

    }

    /**
     * Hides the (overview/normal) interval and show editable.
     */
    showEditableInterval() {
        this._$overviewIntervalElem.hide();
        this._$editableIntervalElem.show();
    }

    /**
     * Hides editable interval and shows overview interval.
     */
    showOverviewInterval() {
        this._$editableIntervalElem.hide();
        this._$overviewIntervalElem.show();
    }
}
