/**
 * Represents all intervals for one device ie. list of all intervals
 */
class Intervals extends ConfigItem {
    constructor(deviceId) {
        super(deviceId);
        this._$container = this._findContainer();
        this._intervalClassElems = this._findIntervalElems(this._$container);
        this._$editButtonElem = undefined;
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
     * @note all intervals should have id in this form: "<devID>_interval"
     * @private
     */
    _findContainer() {
        return $(".interval").filter(function(index, element) {
            return element.id.startsWith(this._domContainerId) &&
                element.id.endsWith("_interval");
        });
    }

    /**
     *
     * @param $container
     * @return {Array}
     * @private
     */
    _findIntervalElems($container) {
        let intervalElems = [];
        let children = $container.children;
        for (let child of children) {
            let $intervalElem = $(child).find(".interval");
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
        if (this._$editButtonElem === undefined) {
            this._$editButtonElem = $(event.target);
        }

        for (let intervalClassElem of this._intervalClassElems) {
            intervalClassElem.showEditableInterval();
        }
        
        this._$editButtonElem.html("Done");
        this._$editButtonElem.removeAttr("onclick");
        this._$editButtonElem.on("click", this.doneEditingAll());
    }

    doneEditingAll() {

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
        this._$editableIntervalElem = this._findEditableIntervalElem($intervalElement);
        this._fromTimeElem = this._findFromTimeElem($intervalElement);
        this._toTimeElem = this._findToTimeElem($intervalElement);
        this._tempElem = this._findTempElem($intervalElement);
    }

    _findEditableIntervalElem($intervalElement) {
        let parentElement = $intervalElement.parentElement;
        for (let child in parentElement.children) {
            if (child.id.contains("editable")) {
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
