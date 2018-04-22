from django.db import models
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

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
        all_items_str = []
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
    value = models.CharField(max_length=30, default=0)
    time = models.DateTimeField(default=timezone.now)

    def render(self) -> str:
        raise NotImplementedError()


class TempItem(Item):
    device = models.ForeignKey('Device', default=None, on_delete=models.CASCADE)
    name = 'temp'
    type = 'actual'

    def render(self) -> str:
        return render_to_string('items/temp_item.html', {'temperature': self.value})
