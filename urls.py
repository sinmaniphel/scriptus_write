from django.conf.urls import url

from scriptus_write.views import html
from scriptus_write.views import rest

urlpatterns = [
    url(r'^$', html.index, name='index'),
    url(r'^import_os/', html.import_ostorybook, name='import_osb'),
    url(r'^storyboard/', html.show_storyboard, name='show_storyboard'),
    url(r'^rest/scene$', rest.scene_detail, name='scene_json'),
    url(r'^rest/scene_list$', rest.scene_list, name='scene_list_json')
]
