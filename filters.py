import django_filters as d_filters
from rest_framework import filters as r_filters

from scriptus_write.models import Scene


class SceneFilter(r_filters.FilterSet):
    __time_filter_choices = (
        ('timed', 'Timed'),
        ('untimed', 'Timeless'),
        ('all', 'All')
    )
    scene_title = d_filters.CharFilter(lookup_expr="icontains")

    timed = d_filters.MethodFilter()

    class Meta:
        model = Scene
        fields = ['timed']

    def filter_timed(self, q_set, f_value):
        if f_value == "timed":
            return q_set.exclude(timeframe__tf_start__isnull=True)
        if f_value == 'untimed':
            return q_set.filter(timeframe__tf_start__isnull=True)
        return q_set
