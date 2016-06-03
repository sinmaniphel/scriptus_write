from django.http import JsonResponse
import json

from scriptus_write.utils import visutils as vis
from scriptus_write.decorators import json_required

from scriptus_write.models import Scene


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
