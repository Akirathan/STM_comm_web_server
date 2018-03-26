from django.urls import path
from . import views

urlpatterns = [
    path('actual/<str:actual_item>/', views.actual, name='actual')
]
