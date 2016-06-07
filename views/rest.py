# from django.http import JsonResponse
# import json

# from scriptus_write.utils import visutils as vis
# from scriptus_write.decorators import json_required

from scriptus_write.models import Scene

from scriptus_write.rest_serializers import SceneSerializer

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


class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer

'''
@json_required
def scene_detail(request):
    if request.method == 'POST':
        # POST goes here . is_ajax is must to capture ajax requests. Beginner's
        # pit.
        scene_id = request.POST.get('scene_id')
        scene = Scene.objects.get(pk=scene_id)
        data = vis.convert_scene_to_vis(scene)

        return JsonResponse(data)


@json_required
def scene_list(request):
    if request.method == 'POST':
        # POST goes here . is_ajax is must to capture ajax requests. Beginner's
        # pit.
        scenes = Scene.objects.all()
        data = vis.convert_scenes_to_vis(scenes)
        return JsonResponse(data)
'''
