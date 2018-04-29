var intervalsChanged = false;

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

function findParentEditableIntervalId(textAreaElement) {
    var parentElement = textAreaElement.parentElement;
    while (!parentElement.id.startsWith("editable_")) {
        parentElement = parentElement.parentElement;
    }
    return parentElement.id;
}
