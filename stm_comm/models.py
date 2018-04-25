from django.db import models
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
import json

# Primary key (serial number or other ID) of Device is expected to be set
# before the device attempts to connect for the first time.


# Create your models here.
class Device(models.Model):
    # Serial number (or other ID) of device
    device_id = models.CharField(primary_key=True, max_length=20)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # online/offline
    status = models.CharField(max_length=7)
    fw_version = models.CharField(max_length=10)
    # private DES key
    key = models.CharField(max_length=8)

    def set_online(self) -> None:
        self.status = 'online'
        return

    def set_offline(self) -> None:
        self.status = 'offline'
        return

    def __get_all_items__(self):
        temp_item = self.tempitem_set
        if temp_item.count() > 1:
            raise Exception('Too much temp items for one device')
        return temp_item

    def render_all_items(self) -> str:
        all_items_str = ""
        all_items = self.__get_all_items__()
        for item in all_items.all():
            all_items_str += item.render()

        return all_items_str


class Item(models.Model):
    class Meta:
        abstract = True

    name = models.CharField(max_length=20)
    # actual/config
    type = models.CharField(max_length=10)
    value = models.CharField(max_length=60, default=0)
    time = models.DateTimeField(default=timezone.now)

    def render(self) -> str:
        raise NotImplementedError()


class ActualItem(Item):
    class Meta:
        abstract = True

    type = 'actual'


class ConfigItem(Item):
    class Meta:
        abstract = True

    type = 'config'


class TempItem(ActualItem):
    device = models.ForeignKey('Device', default=None, on_delete=models.CASCADE)
    name = 'temp'

    def render(self) -> str:
        return render_to_string('items/temp_item.html', {'temperature': self.value})


class Time:
    def __init__(self, hours: int, minutes: int):
        self.hours = hours
        self.minutes = minutes


class Interval:
    def __init__(self, from_time: Time, to_time: Time, temp: int):
        self.from_time = from_time
        self.to_time = to_time
        self.temp = temp


class IntervalsItem(ConfigItem):
    device = models.ForeignKey('Device', default=None, on_delete=models.CASCADE)
    name = 'intervals'

    def render(self) -> str:
        return render_to_string('items/intervals.html', {'interval_list': self.__get_intervals__()})

    def __get_intervals__(self) -> [Interval]:
        """
        Parses all the intervals that are in self.value in JSON format
        """
        json_object = json.loads(self.value)
        from_time = Time(json_object['from']['hours'], json_object['from']['minutes'])
        to_time = Time(json_object['to']['hours'], json_object['to']['minutes'])
        interval = Interval(from_time, to_time, json_object['temp'])
        return [interval]
