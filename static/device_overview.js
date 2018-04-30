function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ensureCsrf() {
    var csrftoken = getCookie('csrftoken');

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}

/**
 * All config items ie. items that can be changed and later saved into device.
 * @type {*[]}
 */
const configItems = [intervals];
var deviceId = undefined;

function saveIntoDevice(event) {
    ensureCsrf();

    configItems.forEach(function(configItem) {
        if (configItem.isChanged()) {
            configItem.saveIntoDevice(deviceId);
        }
    });
}

function setDeviceId(devId) {
    deviceId = devId;
}

function discardChanges(event) {

}