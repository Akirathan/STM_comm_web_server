from django.urls import path
from . import views

urlpatterns = [
    path('connect/<str:device_id>/', views.connect, name='connect'),
    path('actual/<str:actual_item>/', views.actual, name='actual')
]
