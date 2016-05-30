from django import forms


class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=512)
    f_file = forms.FileField()
