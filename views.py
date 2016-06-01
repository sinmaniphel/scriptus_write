from django.shortcuts import render
from .forms import UploadFileForm
from scriptus_write.utils import ostorybook as osb
from scriptus_write.utils import visutils as vis
from django.db import transaction
from scriptus_write.utils import fsmanager as fs
import datetime as dt


from .models import Scene
# Create your views here.
from django.http import JsonResponse


def index(request):
    return render(request, "scriptus/index.html")


@transaction.atomic
def import_ostorybook(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            results = handle_uploaded_osb_file(
                request.FILES['f_file'],
                request.POST['title'])
            return render(request,
                          'scriptus/ossuccess.html',
                          {'results': results})
    else:
        form = UploadFileForm()
    return render(request, 'scriptus/uploadosbook.html', {'form': form})


def show_storyboard(request):
    timed_objs = Scene.objects.filter(timeframe__tf_start__isnull=False)
    all_objs = Scene.objects.filter(timeframe__tf_start__isnull=True)
    scenes = {'timed_vis': vis.convert_scenes_to_vis(timed_objs),
              'timed': timed_objs,
              'untimed': all_objs
              }

    return render(request,
                  'scriptus/scene/dashboard.html',
                  {'scenes': scenes,
                   'story': timed_objs[0].story.title})


def handle_uploaded_osb_file(dbfile, name):
    importer = osb.OStoryBookLoader()
    return importer.import_from_sqlite(dbfile, name)


def scene_json_content(request):
    if request.method == 'POST':
        # POST goes here . is_ajax is must to capture ajax requests. Beginner's
        # pit.
        if request.is_ajax():
            # Always use get on request.POST. Correct way of querying a
            # QueryDict.
            scene_id = request.POST.get('scene_id')
            scene = Scene.objects.get(pk=scene_id)
            t_delta = dt.timedelta(1)
            sc_start = scene.timeframe.tf_start
            data = {
                'scene_id': scene_id,
                'title': scene.scene_title,
                'content': fs.get_string_content(
                    scene.description
                ).replace('\\n', ''),
            }

            if sc_start is not None:
                sc_start_date = sc_start.date()
                sc_end = sc_start + t_delta
                sc_end_date = sc_end.date()
                data['start'] = sc_start_date
                data['end'] = sc_end_date
                data['dt_start'] = sc_start
                data['dt_end'] = scene.timeframe.tf_end

            return JsonResponse(data)
