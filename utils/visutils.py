# from scriptus_write.models import Scene
import json
import datetime as dt
from scriptus_write.utils import fsmanager as fs
from django.urls import reverse


__one_hour_dt = dt.timedelta(0, 3600)
__one_day_dt = dt.timedelta(1)

convert_to_json_datetime = lambda d_time: d_time.strftime('%Y-%m-%dT%H:%M:%S')
convert_to_json_date = lambda d_time: d_time.date().strftime('%Y-%m-%dT%H:%M:%S')


def convert_scene_to_vis(scene):
    sc_dict = convert_scene_to_json(scene)
    # return sc_dict
    sc_dict['id'] = scene.id
    sc_dict['scene_id'] = scene.id
    sc_dict['title'] = scene.scene_title
    sc_dict['description'] = fs.get_string_content(
        scene.description
    ).replace('\\n', '')
    if scene.timeframe.tf_start is not None:
        __add_vis_content(sc_dict, scene)
    return sc_dict


def __add_vis_content(sc_dict, scene):
    sc_dict['content'] = scene.scene_title

    sc_start = scene.timeframe.tf_start
    sc_dict['start'] = convert_to_json_datetime(scene.timeframe.tf_start)
    sc_end = scene.timeframe.tf_end
    if sc_end is None:
        sc_end = sc_start + __one_hour_dt
    sc_dict['end'] = convert_to_json_datetime(sc_end)
    sc_dict['dt_start'] = convert_to_json_date(sc_start)
    sc_dict['dt_end'] = convert_to_json_date(sc_start + __one_day_dt)


def convert_scene_to_json(scene):
    sc_dict = {}
    # return sc_dict
    sc_dict['id'] = scene.id
    sc_dict['scene_id'] = scene.id
    sc_dict['content'] = scene.scene_title
    sc_dict['title'] = scene.scene_title
    sc_dict['description'] = fs.get_string_content(
        scene.description
    ).replace('\\n', '')
    sc_dict['url'] = reverse('scene_json')
    return sc_dict


def convert_scenes_to_vis(l_scenes):
    l_ret = []
    for scene in l_scenes:
        l_ret.append(convert_scene_to_vis(scene))
    return {'scenes': l_ret}
