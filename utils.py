from datetime import datetime
from django.contrib.auth.models import User
from stm_comm.models import Device, Interval, Time


def remove_users_device(user_name: str, device_id: str) -> None:
    user = User.objects.get(username=user_name)
    if user is None:
        raise ValueError('Non exiting user_name')

    device = Device.objects.get(device_id=device_id)
    device.remove_user()


def add_dummy_intervals_to_device(device_id: str, intervals_num: int) -> None:
    """
    Generates dummy intervals and saves them into the database
    :param device_id:
    :param intervals_num: Number of intervals to generate
    :return:
    """
    intervals = []
    for i in range(intervals_num):
        interval = Interval(Time(i, 0), Time(i+1, 0), i+10)
        intervals.append(interval)

    device = Device.objects.get(device_id=device_id)
    device.set_intervals(intervals, _get_current_timestamp())


def _create_stm1() -> None:
    if Device.objects.get(device_id='stm1') is not None:
        return
    device = Device(device_id='stm1', user=None, status='offline', fw_version='1.0', key=None)
    device.save()


def _get_current_timestamp() -> int:
    return int(datetime.now().timestamp())
