from django.shortcuts import render
from django.urls import reverse
from django.db import transaction

from scriptus_write.forms import UploadFileForm
from scriptus_write.utils import ostorybook as osb
from scriptus_write.utils import visutils as vis
from scriptus_write.utils import fsmanager as fs

from scriptus_write.models import Scene
from scriptus_write.models import Story

import datetime as dt


# Create your views here.


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
    return render(request,
                  'scriptus/scene/dashboard.html',
                  {'story': Story.objects.get(pk=1).title})

def characters(request):
    return render(request, "scriptus/character/index.html")


def handle_uploaded_osb_file(dbfile, name):
    importer = osb.OStoryBookLoader()
    return importer.import_from_sqlite(dbfile, name)


def new_func(request):
    return render(request, 'scriptus/scene/dashboard.html')
