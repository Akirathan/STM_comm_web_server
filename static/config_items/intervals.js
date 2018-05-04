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
        this._$editButtonElem.on("click", this.editAll);
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

    doneEditingAll() {
        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showOverviewInterval();
        }

        this._$editButtonElem.html("Edit");
        this._$editButtonElem.off("click");
        this._$editButtonElem.on("click", editAll());

        // if intervals changed, show "Save into device" button.
    }

    static onEditAll(event) {
        // Hide all (overview) intervals
        let intervals = this._getIntervalsFromElement(event.target);
        interval.editAll(event);
    }

    static onIntervalFromFieldChange(event) {

    }

    static onIntervalToFieldChange(event) {

    }

    static onIntervalTempFieldChange(event) {

    }

    static onIntervalDelete(event) {

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
    }

    _attachEventHandlers() {

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

    _findEditableFromTimeElem($editableIntervalElem) {
        return $editableIntervalElem.find("*").filter(function(index, element) {
            return element.id.search("from") > -1;
        })[0];
    }

    _findEditableToTimeElem($editableIntervalElem) {
        return $editableIntervalElem.find("*").filter(function(index, element) {
            return element.id.search("to") > -1;
        })[0];
    }

    _findEditableTempElem($editableIntervalElem) {
        return $editableIntervalElem.find("*").filter(function(index, element) {
            return element.id.search("temp") > -1;
        })[0];
    }

    /**
     * Hides the (overview/normal) interval and show editable.
     */
    showEditableInterval() {

    }

    /**
     * Hides editable interval and shows overview interval.
     */
    showOverviewInterval() {

    }

    /**
     * Hides this interval (sets display:none)
     */
    delete() {

    }

    /**
     * Updates (overview) interval from time field.
     * @param timeStr
     */
    changeFromTime(timeStr) {

    }

    changeToTime(timeStr) {

    }

    changeTemp(tempStr) {

    }
}
