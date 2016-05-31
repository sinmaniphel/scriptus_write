# from scriptus_write.models import Scene
import json


def convert_scene_to_vis(scene):
    sc_dict = {}
    # return sc_dict
    sc_dict['id'] = scene.id
    sc_dict['content'] = scene.scene_title
    sc_dict['start'] = str(scene.timeframe.tf_start)
    end = scene.timeframe.tf_end
    # if end is not None:
    #    sc_dict['end'] = str(end)
    return sc_dict


def convert_scenes_to_vis(l_scenes):
    l_ret = []
    for scene in l_scenes:
        l_ret.append(convert_scene_to_vis(scene))
    return json.dumps(l_ret)
