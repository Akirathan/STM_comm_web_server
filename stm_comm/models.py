from django.db import models
from django.conf import settings
from django.template.loader import render_to_string

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

    def render_all_items(self) -> str:
        pass


class Item(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    # actual/config
    type = models.CharField(max_length=10)
    value = models.CharField(max_length=30)
    time = models.DateTimeField()

    def render(self) -> str:
        raise NotImplementedError()


class ActualItem(Item):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.type = 'actual'

    def render(self) -> str:
        raise NotImplementedError()


class TempItem(ActualItem):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = 'temp'

    def render(self) -> str:
        return render_to_string('items/temp_item.html', {'temperature': self.value})
