from django.urls import path
from . import views

app_name = 'user_interface'
urlpatterns = [
    path('', views.index, name='index')
]
