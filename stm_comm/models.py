from django.db import models
from django.conf import settings

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


class Item(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    type = models.CharField(max_length=10)
    value = models.CharField(max_length=30)
    time = models.DateTimeField()
