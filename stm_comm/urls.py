from django.urls import path
from . import views

app_name = 'stm_comm'
urlpatterns = [
    path('connect', views.connect, name='connect'),
    path('actual/temp/', views.update_temp, name='temp')
]
