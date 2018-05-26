import json
from django.views import View
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from user_interface.views import get_user_devices


class TempsView(View):
    """
    Class for communication with AJAX poller from frontend.
    """

    def get(self, request: HttpRequest) -> HttpResponse:
        devices = get_user_devices(request)
        items = []
        for device in devices:
            item = {'device_id': device.device_id, 'temp': device.get_temp()}
            items.append(item)
        return HttpResponse(json.dumps(items))
