/**
 * Represents all intervals for one device ie. list of all intervals
 */
class Intervals extends ConfigItem {
    constructor(deviceId) {
        super(deviceId);
        this._$container = null;
        this._intervalElems = [];

        this._findContainer();
        this._initializeIntervalElems();
    }

    isChanged() {
        // ...
    }

    saveIntoDevice() {
        // Send intervals AJAX
        // ...
    }

    /**
     * Finds container in which all the intervals are contained.
     * @note all intervals should have id in this form: "<devID>_interval"
     * @private
     */
    _findContainer() {
        this._$container = $(".interval").filter(function(index, element) {
            return element.id.startsWith(this._domContainerId) &&
                element.id.endsWith("_interval");
        });
    }

    _initializeIntervalElems() {
        let children = this._$container.children;
        for (let child of children) {
            let $intervalElem = $(child).find(".interval");
            this._intervalElems.push(new Interval($intervalElem));
        }
    }

    static onEditAll(event) {
        // Hide all (overview) intervals
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
