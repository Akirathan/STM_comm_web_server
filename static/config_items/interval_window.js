/**
 * Represents both overview and editable interval.
 */
class IntervalWindow {
    constructor($intervalElement) {
        this._isChanged = false;
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

    /**
     * Return value of this IntervalWindow.
     * @return {Interval}
     */
    getValue() {
        let fromTimeHours = this._fromTimeElem.innerHTML.substring(0, 2);
        let fromTimeMinutes = this._fromTimeElem.innerHTML.substring(3);
        let fromTimeHoursInt = parseInt(fromTimeHours, 10);
        let fromTimeMinutesInt = parseInt(fromTimeMinutes, 10);
        let fromTime = new Time(fromTimeHoursInt, fromTimeMinutesInt);

        let toTimeHours = this._toTimeElem.innerHTML.substring(0, 2);
        let toTimeMinutes = this._toTimeElem.innerHTML.substring(3);
        let toTimeHoursInt = parseInt(toTimeHours, 10);
        let toTimeMinutesInt = parseInt(toTimeMinutes, 10);
        let toTime = new Time(toTimeHoursInt, toTimeMinutesInt);

        let tempInt = parseInt(this._tempElem.innerHTML, 10);

        return new Interval(fromTime, toTime, tempInt);
    }

    _attachEventHandlers() {
        let _this = this;
        $(this._editableFromTimeElem).on("change", function(){_this.onChangeFromTime(event);});
        $(this._editableToTimeElem).on("change", function(){_this.onChangeToTime(event);});
        $(this._editableTempElem).on("change", function(){_this.onChangeTemp(event);});
        $(this._deleteButton).on("change", function(){_this.onDelete(event);});
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
        this._fromTimeElem.innerHTML = event.target.value;
        this._isChanged = true;
    }

    onChangeToTime(event) {
        this._toTimeElem.innerHTML = event.target.value;
        this._isChanged = true;
    }

    onChangeTemp(event) {
        this._tempElem.innerHTML = event.target.value;
        this._isChanged = true;
    }

    /**
     * Hides this interval (sets display:none)
     */
    onDelete(event) {

    }

    isChanged() {
        return this._isChanged;
    }

    /**
     *
     * @return {string}
     */
    toJSON() {
        let fromTimeHours = this._fromTimeElem.innerHTML.substring(0, 2);
        let fromTimeMinutes = this._fromTimeElem.innerHTML.substring(3);
        let fromTimeHoursInt = parseInt(fromTimeHours, 10);
        let fromTimeMinutesInt = parseInt(fromTimeMinutes, 10);
        let fromTime = new Time(fromTimeHoursInt, fromTimeMinutesInt);

        let toTimeHours = this._toTimeElem.innerHTML.substring(0, 2);
        let toTimeMinutes = this._toTimeElem.innerHTML.substring(3);
        let toTimeHoursInt = parseInt(toTimeHours, 10);
        let toTimeMinutesInt = parseInt(toTimeMinutes, 10);
        let toTime = new Time(toTimeHoursInt, toTimeMinutesInt);

        let tempInt = parseInt(this._tempElem.innerHTML, 10);

        let interval = new Interval(fromTime, toTime, tempInt);

        return JSON.stringify(interval);
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

/**
 * Time and Interval classes are used just for serialization into AJAX request and
 * deserialization from response.
 */
class Time {
    static compareTimes(timeA, timeB) {
        return timeA.hours === timeB.hours && timeA.minutes === timeB.minutes;
    }

    /**
     * @param hours {int}
     * @param minutes {int}
     */
    constructor(hours, minutes) {
        this.hours = hours;
        this.minutes = minutes;
    }
}

class Interval {
    /**
     * Compares given arrays of intervals.
     * @param intervalArrayA
     * @param intervalArrayB
     * @return {boolean}
     */
    static compareIntervalArrays(intervalArrayA, intervalArrayB) {
        if (intervalArrayA.length !== intervalArrayB.length) {
            return false;
        }

        for (let i = 0; i < intervalArrayA.length; i++) {
            if (!this._compareIntervals(intervalArrayA[i], intervalArrayB[i])) {
                return false;
            }
        }

        return true;
    }

    static _compareIntervals(intervalA, intervalB) {
        return Time.compareTimes(intervalA.from, intervalB.from) &&
            Time.compareTimes(intervalA.to, intervalB.to) &&
            intervalA.temp === intervalB.temp;
    }

    /**
     * @param fromTime {Time}
     * @param toTime {Time}
     * @param temp {int}
     */
    constructor(fromTime, toTime, temp) {
        this.from = fromTime;
        this.to = toTime;
        this.temp = temp;
    }
}
