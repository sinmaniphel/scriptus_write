from django.conf.urls import url, include

from scriptus_write.views import html
from scriptus_write.views import rest

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', rest.UserViewSet)
router.register(r'groups', rest.GroupViewSet)
router.register(r'scenes', rest.SceneViewSet)

urlpatterns = [
    url(r'^$', html.index, name='index'),
    url(r'^import_os/', html.import_ostorybook, name='import_osb'),
    url(r'^storyboard/', html.show_storyboard, name='show_storyboard'),
    url(r'^rest/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

]
