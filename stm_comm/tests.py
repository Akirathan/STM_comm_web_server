from django.test import TestCase
from django.urls import reverse
from .models import Device


# Create your tests here.
class DeviceConnectionTests(TestCase):
    def test_first_connection_ok(self):
        # insert device into database
        device = Device(device_id='stm1')
        device.save()

        response = self.client.get(reverse('stm_comm:connect', args=['stm1']))
        self.assertEqual(response.status_code, 200)
        return

    def test_first_connection_error(self):
        response = self.client.get(reverse('stm_comm:connect', args=['prdlajs']))
        self.assertEqual(response.status_code, 404)
        return
