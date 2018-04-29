var intervalsChanged = false;

/**
 *
 * @param hours str
 * @param minutes str
 * @constructor
 */
function Time(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
}

/**
 *
 * @param fromTime Time
 * @param toTime Time
 * @param temp int
 * @constructor
 */
function Interval(fromTime, toTime, temp) {
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.temp = temp;
}

var intervalCollector = {
    /**
     * @return Interval[]
     */
    collectIntervals : function() {
        var columns = $(".row").children();
        var intervals = new [];
        columns.forEach(function() {
            var interval = this.collectInterval(columnElement);
            intervals.append(interval);
        });
        return intervals;
    },

    collectInterval : function(columnElement) {
        var fromString = $(columnElement).find(".from").html();
        var fromHours = fromString.substr(0, 2);
        var fromMinutes = fromString.substr(3);

        var toString = $(columnElement).find(".to").html();
        var toHours = toString.substr(0, 2);
        var toMinutes = toString.substr(3);

        var tempString = $(columnElement).find(".temp").html();

        return new Interval(new Time(fromHours, fromMinutes), new Time(toHours, toMinutes), tempString)
    }
};

/**
 * Saves current interval values into DB, with 'now' timestamp.
 * @note Some intervals were surely edited.
 * @note Called by device_overview.js when "Save into device" button is pressed.
 */
function saveUpdatedIntervalValues() {
    var intervals = intervalCollector.collectIntervals();
    $.ajax({
        url: "...",
        data: intervals,
        contentType: "application/json",
        method: "POST"
    }).success(function(data, textStatus, jqXHR) {
        console.log("Successfully saved intervals into server");
    });
}

function editAll(event) {
    $(".interval").hide();
    $(".editable-interval").show();

    var target = $(event.target);
    target.html("Done");
    target.removeAttr("onclick");
    target.on("click", doneEditingAll);
}

function doneEditingAll(event) {
    $(".editable-interval").hide();
    $(".interval").show();

    var target = $(event.target);
    target.html("Edit");
    target.off("click");
    target.on("click", editAll);

    if (intervalsChanged) {
        showSaveButton();
    }
}

/**
 * Show "save into device" button if some device values were changed.
 */
function showSaveButton() {
    $("#save_to_device_group").show();
}

const IntervalLocation = Object.freeze({
    FROM: 1,
    TO: 2,
    TEMP: 3
});

function intervalChanged(event) {
    intervalsChanged = true;

    // Update value in corresponding (overview) interval.
    var editableIntervalId = findParentEditableIntervalId(event.target);
    var $overviewInterval = getAssociatedOverviewInterval(editableIntervalId);
    var intervalLocation = getCurrentIntervalLocation(event.target);
    updateOverviewIntervalText($overviewInterval, intervalLocation, event.target.value);
}

function deleteInterval(event) {

}

/**
 * Updates text inside specific element inside (overview) interval.
 * @param $overviewInterval
 * @param intervalLocation
 * @param text
 */
function updateOverviewIntervalText($overviewInterval, intervalLocation, text) {
    var classString;
    switch (intervalLocation) {
        case IntervalLocation.FROM:
            classString = ".from";
            break;
        case IntervalLocation.TO:
            classString = ".to";
            break;
        case IntervalLocation.TEMP:
            classString = ".temp";
            break;
    }
    $overviewInterval.find(classString).html(text);
}

/**
 * Finds out if the given (textarea) element is FROM, TO, or TEMP
 * @param textAreaElement text area element inside editable interval
 * @return IntervalLocation
 */
function getCurrentIntervalLocation(textAreaElement) {
    if (textAreaElement.id.startsWith("editable_from")) {
        return IntervalLocation.FROM;
    }
    else if (textAreaElement.id.startsWith("editable_to")) {
        return IntervalLocation.TO;
    }
    else if (textAreaElement.id.startsWith("editable_temp")) {
        return IntervalLocation.TEMP;
    }
}

/**
 *
 * @param editableIntervalId
 * @return jQuery
 */
function getAssociatedOverviewInterval(editableIntervalId) {
    var overviewIntervalId = editableIntervalId.replace("editable_", "");
    return $("#" + overviewIntervalId);
}

/**
 *
 * @param textAreaElement
 * @return {string}
 */
function findParentEditableIntervalId(textAreaElement) {
    var parentElement = textAreaElement.parentElement;
    while (!parentElement.id.startsWith("editable_")) {
        parentElement = parentElement.parentElement;
    }
    return parentElement.id;
}
