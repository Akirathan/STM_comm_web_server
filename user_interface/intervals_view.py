import json
from django.views import View
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from user_interface.views import get_user_devices
from stm_comm.models import Interval, Device


class IntervalsView(View):
    """
    Called by AJAX poller from frontend.
    """

    def get(self, request: HttpRequest) -> HttpResponse:
        """
        Returns JSON string containing intervals for all user's devices.
        JSON format looks like this: [{"device_id":"stm1", "intervals":<intervals>}, {...}]
        :param request:
        :return:
        """
        devices = get_user_devices(request)
        items = []
        item = {}
        for device in devices:
            item['device_id'] = device.device_id
            item['intervals'] = device.get_intervals()
            items.append(item)
        return HttpResponse(self.__items_to_json__(items))

    def __items_to_json__(self, items) -> str:
        """
        Converts given items from get method to json string. Note that the items
        cannot be converted directly by json.dumps.
        :param items: items from get method
        :return: json string
        """
        json_str = '['
        for i in range(len(items)):
            json_str += '{"device_id":"%s","intervals":%s}' % \
                (items[i]['device_id'], Interval.stringify_intervals(items[i]['intervals']))
            if i != len(items) - 1:
                json_str += ','
            else:
                json_str += ']'
        return json_str


    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Processes the POST request from frontend AJAX poller that has the same body
        JSON format as above.
        :param request:
        :return:
        """
        # Parse passed data
        body_str = request.body.decode()
        json_dicts = json.loads(body_str)
        for json_dict in json_dicts:
            device_id = json_dict['device_id']
            intervals_json_dict = json_dict['intervals']
            updated_intervals = Interval.parse_intervals(json.dumps(intervals_json_dict))
            # Save intervals into device
            device = get_object_or_404(Device, device_id=device_id)
            device.set_intervals(updated_intervals)

        return HttpResponse()

