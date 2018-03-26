from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def actual(request, actual_item: str):
    print('in view, actual_item=%s' % actual_item)
    return HttpResponse()
