from django.shortcuts import render
from .forms import UploadFileForm
from scriptus_write.utils import ostorybook as osb
from scriptus_write.utils import visutils as vis
from django.db import transaction

from .models import Scene
# Create your views here.
# from django.http import HttpResponseRedirect


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
    untimed_objs = Scene.objects.filter(timeframe__tf_start__isnull=True)
    scenes = {'timed': vis.convert_scenes_to_vis(timed_objs),
              'untimed': untimed_objs}

    return render(request,
                  'scriptus/scene/dashboard.html',
                  {'scenes': scenes})


def handle_uploaded_osb_file(dbfile, name):
    importer = osb.OStoryBookLoader()
    return importer.import_from_sqlite(dbfile, name)
