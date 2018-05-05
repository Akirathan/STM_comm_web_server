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
        temp_items = self.tempitem_set
        if temp_items.count() > 1:
            raise Exception('Too much temp items for one device')

        intervals_items = self.intervalsitem_set
        if intervals_items.count() > 1:
            raise Exception('Too much interval items for one device')

        return [temp_items.first(), intervals_items.first()]

    def render_all_items(self) -> str:
        all_items_str = ""
        all_items = self.__get_all_items__()
        for item in all_items:
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
        self.__hours_num = hours
        self.__minutes_num = minutes
        return

    def to_json(self) -> str:
        return '{"hours":%d,"minutes":%d}' % (self.__hours_num, self.__minutes_num)

    def __str__(self):
        return '%s:%s' % (self.hours, self.minutes)

    @property
    def minutes(self) -> str:
        if self.__minutes_num < 10:
            return '0%d' % self.__minutes_num
        else:
            return str(self.__minutes_num)

    @property
    def hours(self) -> str:
        if self.__hours_num < 10:
            return '0%d' % self.__hours_num
        else:
            return str(self.__hours_num)


class Interval:
    def __init__(self, from_time: Time, to_time: Time, temp: int):
        self.from_time = from_time
        self.to_time = to_time
        self.temp = temp
        return

    def to_json(self) -> str:
        return '{"from":%s,"to":%s,"temp":%d}' % (self.from_time.to_json(), self.to_time.to_json(), self.temp)

    @staticmethod
    def from_json(json_dict: dict) -> 'Interval':
        from_time = Time(json_dict['from']['hours'], json_dict['from']['minutes'])
        to_time = Time(json_dict['to']['hours'], json_dict['to']['minutes'])
        return Interval(from_time, to_time, json_dict['temp'])

    @staticmethod
    def parse_intervals(json_str: str) -> '[Interval]':
        json_dicts = json.loads(json_str)
        intervals = []
        for json_dict in json_dicts:
            intervals.append(Interval.from_json(json_dict))
        return intervals

    @staticmethod
    def stringify_intervals(intervals: ['Interval']) -> str:
        """ Convert given intervals into JSON string. """
        json_str = ""
        for i in range(0, len(intervals)):
            json_str += intervals[i].to_json()
            if i == len(intervals) - 1:
                json_str += "]"
            else:
                json_str += ","
        return json_str

    def __str__(self):
        return 'from: %s, to: %s, temp: %d' % (self.from_time, self.to_time, self.temp)


class IntervalsItem(ConfigItem):
    device = models.ForeignKey('Device', default=None, on_delete=models.CASCADE)
    name = 'intervals'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.intervals_num = len(self.__get_intervals__())
        return

    def __str__(self):
        retval = '['
        for interval in self.__get_intervals__():
            retval += interval.__str__()
            retval += ','
        retval += ']'
        return retval

    def render(self) -> str:
        return render_to_string('items/intervals.html', {
            'interval_list': self.__get_intervals__(),
            'device_model': self.device
        })

    def __parse_one_interval__(self, interval_dict: dict) -> Interval:
        return Interval.from_json(interval_dict)

    def __get_intervals__(self) -> [Interval]:
        """
        Parses all the intervals that are in self.value in JSON format
        """
        return Interval.parse_intervals(self.value)

    def add_interval(self, interval: Interval):
        # Remove last array bracket
        self.value = self.value.replace(']', '')

        if self.intervals_num >= 1:
            self.value += ','
        self.value += interval.to_json()
        self.value += ']'

        self.intervals_num += 1
        return

    def reset_intervals(self, intervals: [Interval]):
        """
        Resets the value of this item with passed intervals. Note that the passed intervals
        are already parsed.
        :param intervals:
        :return:
        """
        self.value = Interval.stringify_intervals(intervals)
