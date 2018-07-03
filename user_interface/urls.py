from django.urls import path
from . import views
from user_interface.intervals_view import IntervalsView
from user_interface.temps_view import TempsView
from user_interface.device_states_view import DeviceStatesView

app_name = 'user_interface'
urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/login', views.user_login, name='user_login'),
    path('accounts/logout', views.user_logout, name='user_logout'),
    path('accounts/details', views.user_logout, name='user_details'),
    path('devices', views.DevicesView.as_view(), name='devices'),
    path('register-new-device', views.register_new_device, name='register_new_device'),
    path('generate-key', views.generate_key, name='generate_key'),

    # URLs for AjaxPoller
    path('intervals', IntervalsView.as_view(), name='intervals'),
    path('temps', TempsView.as_view(), name='temperatures'),
    path('devstates', DeviceStatesView.as_view(), name='device_states'),
]
