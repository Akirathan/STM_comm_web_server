from django.urls import path
from . import views

app_name = 'user_interface'
urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/login', views.user_login, name='user_login')
]
