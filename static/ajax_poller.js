let intervalsForUpload = undefined;

class AjaxPoller {
    static get INTERVALS_URL() {return "/intervals";}
    static get DEVICES_STATES_URL() {return "/devstates";}
    static get TEMPERATURES_URL() {return "/temps";}

    static startPoll() {
        setTimeout(AjaxPoller._pollDevicesStates, 1500);
    }

    static setIntervalsForUpload(intervals) {
        intervalsForUpload = intervals;
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
                data: JSON.stringify(intervalsForUpload),
                success: function(data) {
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
                    AjaxPoller.startPoll();
                }
            })
        }
    }

    /**
     * Processes device states retrieved from server.
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

    static _processTemperatures(data) {
        let data_json = JSON.parse(data);
        data_json.forEach(function(item) {
            let device = deviceList.getDeviceById(item["device_id"]);
            if (device.getTemperature() !== item["temp"]) {
                device.notifyTemperature(item["temp"]);
            }
        })
    }

    static _processIntervals(data) {
        let data_json = JSON.parse(data);
        data_json.forEach(function(item) {
            let device = deviceList.getDeviceById(item["device_id"]);
            let currentIntervals = device.getIntervals();
            let parsedIntervals = item["intervals"];
            if (!Interval.compareIntervalArrays(currentIntervals, parsedIntervals)) {
                device.notifyIntervals(parsedIntervals);
            }
        })
    }
}

