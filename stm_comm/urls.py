from django.urls import path
from . import views, intervals_view

app_name = 'stm_comm'
urlpatterns = [
    path('connect', views.connect, name='connect'),
    path('actual/temp', views.update_temp, name='temp'),
    path('config/intervals/timestamp', intervals_view.get_intervals_timestamp, name='get_intervals_timestamp'),
    path('config/intervals', intervals_view.get_or_post_intervals, name='get_or_post_intervals')
]
