from django.db import models


class User(models.Model):
    """
    Every User may have many devices.
    """
