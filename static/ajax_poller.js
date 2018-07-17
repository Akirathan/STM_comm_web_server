let intervalsForUpload = undefined;
let intervalsForUploadTimestamp = 0;
let intervalsForUploadDevId = "";
let firstPoll = true;

/**
 * This class polls the backend for various important information - for example
 * all devices' states and all devices' temperatures. These informations are
 * send from backend in JSON format.
 * Note that the AjaxPoller needs to be started with startPoll method.
 */
class AjaxPoller {
    static get INTERVALS_URL() {return "/intervals";}
    static get DEVICES_STATES_URL() {return "/devstates";}
    static get TEMPERATURES_URL() {return "/temps";}

    static startPoll() {
        CsrfProtection.ensureCsrf();
        setTimeout(AjaxPoller._pollDevicesStates, 1500);
    }

    /**
     * Stores given intervals for future upload to the server.
     * @param intervalsTimestamp {int}
     * @param deviceId {string}
     */
    static setIntervalsForUpload(intervals, intervalsTimestamp, deviceId) {
        intervalsForUpload = intervals;
        intervalsForUploadTimestamp = intervalsTimestamp;
        intervalsForUploadDevId = deviceId;
    }

    static _pollDevicesStates() {
        $.ajax({
            url: AjaxPoller.DEVICES_STATES_URL,
            method: "GET",
            success: function(data) {
                AjaxPoller._processDevicesStates(data);
                AjaxPoller._pollTemperatures();
            }
        })
    }

    static _pollTemperatures() {
        $.ajax({
            url: AjaxPoller.TEMPERATURES_URL,
            method: "GET",
            success: function(data) {
                AjaxPoller._processTemperatures(data);
                AjaxPoller._pollIntervals();
            }
        })
    }

    static _pollIntervals() {
        if (intervalsForUpload !== undefined) {
            $.ajax({
                url: AjaxPoller.INTERVALS_URL,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "device_id": intervalsForUploadDevId,
                    "timestamp": intervalsForUploadTimestamp,
                    "intervals": intervalsForUpload
                }),
                success: function(data) {
                    intervalsForUpload = undefined;
                    // notify device that intervals were successfully POSTed
                    let device = deviceList.getDeviceById(intervalsForUploadDevId);
                    device.intervalsUploaded();

                    firstPoll = false;
                    AjaxPoller.startPoll();
                }
            })
        }
        else {
            $.ajax({
                url: AjaxPoller.INTERVALS_URL,
                method: "GET",
                success: function(data) {
                    AjaxPoller._processIntervals(data);
                    firstPoll = false;
                    AjaxPoller.startPoll();
                }
            })
        }
    }

    /**
     * Processes device states retrieved from server.
     * @private
     */
    static _processDevicesStates(data) {
        let data_json = JSON.parse(data);
        data_json.forEach(function(item) {
            let device = deviceList.getDeviceById(item["device_id"]);
            if (device.getState() !== item["state"]) {
                device.changeState(item["state"]);
            }
        })
    }

    /**
     * Processes temperatures from all user's devices retrieved from server.
     * @private
     */
    static _processTemperatures(data) {
        let data_json = JSON.parse(data);
        data_json.forEach(function(item) {
            let device = deviceList.getDeviceById(item["device_id"]);
            if (device.getTemperature() != item["temp"]) {
                device.notifyTemperature(item["temp"]);
            }
        })
    }

    /**
     * Processes intervals data from all user's devices retrieved from server.
     * @private
     */
    static _processIntervals(data) {
        let data_json = JSON.parse(data);
        data_json.forEach(function(item) {
            let device = deviceList.getDeviceById(item["device_id"]);
            let currentIntervals = device.getIntervalsBeforeEditing();
            let parsedIntervals = item["intervals"];
            let serverTimestamp = item["timestamp"];

            if (firstPoll) {
                device.intervalsWindow.initTimestamp(serverTimestamp);
            }

            if (!Interval.compareIntervalArrays(currentIntervals, parsedIntervals) &&
                device.getIntervalsDoneEditingTimestamp() < serverTimestamp)
            {
                device.notifyIntervalsWithTimestamp(parsedIntervals, serverTimestamp);
            }
        })
    }
}

