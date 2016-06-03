from django.http import JsonResponse
import json

from scriptus_write.utils import visutils as vis
from scriptus_write.decorators import json_required, post_required

from scriptus_write.models import Scene


@json_required
@post_required
def scene_detail(request):
    scene_id = request.POST.get('scene_id')
    scene = Scene.objects.get(pk=scene_id)
    data = vis.convert_scene_to_vis(scene)

    return JsonResponse(data)


@json_required
@post_required
def scene_list(request):
    scenes = Scene.objects.all()
    data = vis.convert_scenes_to_vis(scenes)
    return JsonResponse(data)


@json_required
@post_required
def update_scene(request):
    if request.is_ajax() is True:

        str_body = request.body.decode('utf-8')
        print("rq json ! {} |\n-------------".format(str_body))

        rq_json = json.loads(request.body)
        sc_json = rq_json['up_scene']
        i_id = sc_json['id']
        scene = Scene.objects.get(pk=i_id)
        dt_start = sc_json['start']
        if dt_start['start'] is not None:
            __update_time_frame(scene.timeframe, sc_json)
            scene.save()
        return JsonResponse({'result': 'success', 'id': i_id})


def __update_time_frame(tf, sc_json):
    dt_start = sc_json['start']
    dt_end = sc_json['end']
    if dt_end is None:
        dt_end = dt_start + vis.__one_hour_dt
    tf.tf_start = dt_start
    tf.tf_end = dt_end
    tf.save()
