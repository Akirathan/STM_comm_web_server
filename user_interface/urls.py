from django.urls import path
from . import views
from user_interface.intervals_view import IntervalsView
from user_interface.temps_view import TempsView

app_name = 'user_interface'
urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/login', views.user_login, name='user_login'),
    path('accounts/logout', views.user_logout, name='user_logout'),
    path('accounts/details', views.user_logout, name='user_details'),
    path('devices', views.DevicesView.as_view(), name='devices'),
    path('intervals', IntervalsView.as_view(), name='intervals'),
    path('temps', TempsView.as_view(), name='temps'),
]
