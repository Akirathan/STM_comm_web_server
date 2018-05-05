from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout
from django.views import View
from stm_comm.models import Device, Interval
import json


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')


def user_login(request: HttpRequest) -> HttpResponse:
    if request.method != 'POST':
        return HttpResponse(404)

    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is None:
        return HttpResponse(404)  # TODO

    login(request, user)
    return render(request, 'index.html')


def user_details(request: HttpRequest) -> HttpResponse:
    return render(request, 'user_details.html')


def user_logout(request: HttpRequest) -> HttpResponse:
    logout(request)
    return render(request, 'index.html')


def get_user_devices(request: HttpRequest) -> [Device]:
    user = request.user
    if not user.is_authenticated:
        return []

    return user.device_set.all()


class DevicesView(View):

    def get(self, request: HttpRequest) -> HttpResponse:
        devices = get_user_devices(request)
        return render(request, 'devices/devices.html', {'devices_model_list': devices})


def save_intervals_to_db(request: HttpRequest) -> HttpResponse:
    """
    Request body is supposed to contain JSON data format. In this JSON body there
    should be "device_id" and "intervals" specified.
    :param request:
    :return:
    """
    if request.method != 'POST':
        return HttpResponse(404)
    # Parse passed data
    body_str = request.body.decode('utf-8')
    json_dict = json.loads(body_str)
    device_id = json_dict['device_id']
    intervals_json_dict = json_dict['intervals']
    updated_intervals = Interval.parse_intervals(json.dumps(intervals_json_dict))
    # Save intervals into device
    device = get_object_or_404(Device, device_id=device_id)
    device.set_intervals(updated_intervals)

    return HttpResponse()
