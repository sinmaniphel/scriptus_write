from django.shortcuts import render
from .forms import UploadFileForm
from scriptus_write.utils import ostorybook as osb
from django.db import transaction

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


def handle_uploaded_osb_file(dbfile, name):
    importer = osb.OStoryBookLoader()
    return importer.import_from_sqlite(dbfile, name)
