/**
 * This class contains a string for one interval.
 * This is not a good idea and should be replaced when some frontend framework
 * will be integrated.
 */
class IntervalTemplate {
    /**
     * @param deviceId {string}
     * @param index {int} index of the new interval window to be rendered.
     * @param intervalClass {Interval} may be undefined - in that case, values are rendered default
     * @return {IntervalWindow}
     */
    static renderNewIntervalWindow(deviceId, index, intervalClass) {
        if (intervalClass === undefined) {
            intervalClass = new Interval(new Time(0, 0), new Time(0, 0), 0);
        }

        this._convertTimesToString(intervalClass);

        let htmlString = `
<div class="col-md-1">
    <!-- Overview interval -->
    <div class="interval" id="${deviceId}_interval_${index}">
      <div id="${deviceId}_from_${index}"
           class="from">${intervalClass.from.hours}:${intervalClass.from.minutes}</div>
      <div id="${deviceId}_to_${index}"
           class="to">${intervalClass.to.hours}:${intervalClass.to.minutes}</div>
      <div id="${deviceId}_temp_${index}"
           class="temp">${intervalClass.temp}</div>
    </div> <!-- interval -->

    <!-- Editable interval (hidden) -->
    <div class="editable-interval" id="${deviceId}_editable_interval_${index}"
         style="display: none">
      <!-- from textarea -->
      <div style="position: absolute; top: 3%; left: 2%;">
        <textarea id="${deviceId}_editable_interval_from_${index}" maxlength="5"
                  style="resize: none; width: 45px; height: 25px;"
        >${intervalClass.from.hours}:${intervalClass.from.minutes}</textarea>
        <span style="position: relative; bottom: 5px;">
          -
        </span>
      </div>
      <!-- to textarea -->
      <textarea id="${deviceId}_editable_interval_to_${index}" maxlength="5"
                style="resize: none; width: 45px; height: 25px; position: absolute; top: 3%; left: 55%;"
      >${intervalClass.to.hours}:${intervalClass.to.minutes}</textarea>
      <!-- temp teaxtarea -->
      <div style="position: absolute; top: 30px; left: 35%;">
        <textarea id="${deviceId}_editable_interval_temp_${index}" maxlength="2"
                  style="resize: none; width: 25px; height: 25px;">${intervalClass.temp}</textarea>
        <span style="position: relative; bottom: 8px; right: 2px">
          °
        </span>
      </div>
      <!-- delete button -->
      <button class="btn btn-danger"
              id="${deviceId}_editable_interval_deletebutton_${index}"
              type="button" style="position: absolute; bottom: 3%; left: 30%; padding: 0 3px">
        delete
      </button>
    </div> <!-- interval (editable interval) -->
  </div> <!-- col-md-1 -->
      `;

        let htmlNodes = $.parseHTML($.trim(htmlString));
        let colElement = htmlNodes[0];
        return new IntervalWindow($(colElement.children[0]));
    }

    /**
     * Converts int time to string time in given intervalClass.
     * This is done for correct rendering.
     * @param intervalClass {Interval}
     * @private
     */
    static _convertTimesToString(intervalClass) {
        intervalClass.from.hours = this._convertTimeToString(intervalClass.from.hours);
        intervalClass.from.minutes = this._convertTimeToString(intervalClass.from.minutes);
        intervalClass.to.hours = this._convertTimeToString(intervalClass.to.hours);
        intervalClass.to.minutes = this._convertTimeToString(intervalClass.to.minutes);
    }

    /**
     *
     * @param time {int}
     * @private
     * @return {string}
     */
    static _convertTimeToString(time) {
        if (time < 10) {
            return "0" + time;
        }
        else {
            return time + "";
        }
    }
}
