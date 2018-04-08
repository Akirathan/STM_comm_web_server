from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')


def user_login(request: HttpRequest) -> HttpResponse:
    if request.method != 'POST':
        return HttpResponse(404)

    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is None:
        return HttpResponse(404)  # TODO

    login(request, user)
    return render(request, 'index.html')


def user_logout(request: HttpRequest) -> HttpResponse:
    logout(request)
    return render(request, 'index.html')
