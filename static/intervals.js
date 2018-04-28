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

function intervalChanged(event) {
    intervalsChanged = true;

    var overviewInterval = getAssociatedOverviewInterval(event.target.id);
    overviewInterval.html(event.target.value);
}

function deleteInterval(event) {

}

function getAssociatedOverviewInterval(editableIntervalId) {
    var overviewIntervalId = editableIntervalId.replace("editable_", "");
    return $("#" + overviewIntervalId);
}

