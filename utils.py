from datetime import datetime
from django.contrib.auth.models import User
from stm_comm.models import Device, Interval, Time


def init_database() -> None:
    """
    Initializes database with some simple values: Nobody user and stm1 device.
    Nobody user does not have any devices associated.
    stm1 device does not have key.
    After calling this function, one should generate new key for the device...
    """
    # Create user if not exist
    user_query_set = User.objects.filter(username='Nobody')
    if user_query_set.count() == 0:
        user = User(username='Nobody', password='poklop')
        user.save()
    else:
        user = user_query_set.first()
        remove_users_device(user.username, 'stm1')

    # Create device if not exist
    device_query_set = Device.objects.filter(device_id='stm1')
    if device_query_set.count() == 0:
        device = Device(device_id='stm1', status='offline', fw_version='1.0', user=None, key=None)
    else:
        device = device_query_set.first()
        device.remove_user()
        device.remove_key()
        device.set_offline()

    # Add some dummy intervals with current timestamp to the device
    add_dummy_intervals_to_device(device.device_id, 3)


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
