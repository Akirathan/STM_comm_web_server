from django.contrib.auth.models import User
from stm_comm.models import Device


def _create_stm1() -> None:
    if Device.objects.get(device_id='stm1') is not None:
        return
    device = Device(device_id='stm1', user=None, status='offline', fw_version='1.0', key=None)
    device.save()


def remove_users_device(user_name: str, device_id: str) -> None:
    user = User.objects.get(username=user_name)
    if user is None:
        raise ValueError('Non exiting user_name')

    device = Device.objects.get(device_id=device_id)
    device.remove_user()

