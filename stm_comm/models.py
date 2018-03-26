from django.db import models


# Create your models here.
class Device(models.Model):
    # online/offline
    status = models.CharField(max_length=7)
    fw_version = models.CharField(max_length=10)
    # private DES key
    key = models.CharField(max_length=8)


class Item(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    type = models.CharField(max_length=10)
    value = models.CharField(max_length=30)
    time = models.DateTimeField()
