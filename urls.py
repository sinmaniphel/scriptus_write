from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^import_os/', views.import_ostorybook, name='import_osb')
]
