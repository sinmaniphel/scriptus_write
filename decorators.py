from django.http import HttpResponseForbidden
from functools import wraps


def json_required(a_view):
    def _wrapped_view(request, *args, **kwargs):
        if request.is_ajax() is True:
            return a_view(request, *args, **kwargs)
        else:
            return HttpResponseForbidden()
    return wraps(a_view)(_wrapped_view)


def post_required(a_view):
    def _wrapped_view(request, *args, **kwargs):
        if request.method == 'POST':
            return a_view(request, *args, **kwargs)
        else:
            return HttpResponseForbidden()
    return wraps(a_view)(_wrapped_view)
