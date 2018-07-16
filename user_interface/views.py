from django.contrib.auth import login, authenticate, logout
from django.http import HttpResponse, HttpRequest
from django.shortcuts import render
from django.views import View

from stm_comm.models import Device
from stm_comm.key_manager import KeyManager


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


def register_new_device(request: HttpRequest) -> HttpResponse:
    return render(request, 'register_new_device.html')


def generate_key(request: HttpRequest) -> HttpResponse:
    """
    Generates new DES key for a device (from device_id text input).
    The user from request parameter is assigned into the device.
    :param request:
    :return:
    """
    query_set = Device.objects.filter(device_id=request.POST['device_id'])
    device = query_set.first()
    if device is None:
        return render(request, 'generate_key_error.html')

    des_key = KeyManager.generate_key()

    # Remove "old" key
    device.remove_key()
    device.set_user(request.user)

    return render(request, 'generate_key.html', {'key': des_key.hex_str})


class DevicesView(View):

    def get(self, request: HttpRequest) -> HttpResponse:
        devices = get_user_devices(request)
        return render(request, 'devices/devices.html', {'devices_model_list': devices})

