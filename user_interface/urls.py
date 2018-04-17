from django.urls import path
from . import views

app_name = 'user_interface'
urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/login', views.user_login, name='user_login'),
    path('accounts/logout', views.user_logout, name='user_logout'),
    path('accounts/details', views.user_logout, name='user_details'),
    path('devices', views.DevicesView.as_view(), name='devices'),
]
