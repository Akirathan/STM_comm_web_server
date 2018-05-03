class Intervals extends ConfigItem {
    constructor(deviceId) {
        super(deviceId);
        this._container = null;

        this._findContainer();
    }

    isChanged() {
        // ...
    }

    saveIntoDevice() {
        // Send intervals AJAX
        // ...
    }

    _findContainer() {
        this._container = $(".interval").filter(function(index, element) {
            return element.id.startsWith(this._domContainerId) &&
                element.id.endsWith("_interval");
        });
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
