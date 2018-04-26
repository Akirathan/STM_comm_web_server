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
}

function deleteInterval(event) {

}

