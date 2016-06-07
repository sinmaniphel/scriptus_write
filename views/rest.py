# from django.http import JsonResponse
# import json


from scriptus_write.models import Scene
from scriptus_write.models import TimeFrame

from scriptus_write.rest_serializers import SceneSerializer
from scriptus_write.rest_serializers import TimeFrameSerializer

from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from scriptus_write.rest_serializers import UserSerializer, GroupSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TimeFrameViewSet(viewsets.ModelViewSet):

    queryset = TimeFrame.objects.all().order_by('tf_start')
    serializer_class = TimeFrameSerializer


class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
