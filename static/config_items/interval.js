/**
 * Represents both overview and editable interval.
 */
class Interval {
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
        function Time(hours, minutes) {
            this.hours = hours;
            this.minutes = minutes;
        }

        function Interval(fromTime, toTime, temp) {
            this.fromTime = fromTime;
            this.toTime = toTime;
            this.temp = temp;
        }

        let fromTimeHours = this._fromTimeElem.innerHTML.substring(0, 2);
        let fromTimeMinutes = this._fromTimeElem.innerHTML.substring(3);
        let fromTime = new Time(fromTimeHours, fromTimeMinutes);

        let toTimeHours = this._toTimeElem.innerHTML.substring(0, 2);
        let toTimeMinutes = this._toTimeElem.innerHTML.substring(3);
        let toTime = new Time(toTimeHours, toTimeMinutes);

        let temp = this._tempElem.innerHTML;

        let interval = new Interval(fromTime, toTime, temp);

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
