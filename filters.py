from django_filters import rest_framework as r_filters
#from rest_framework import filters as r_filters

from scriptus_write.model.story import Scene
from scriptus_write.model.story import Character
from scriptus_write.model.story import SceneCharacter


class SceneFilter(r_filters.FilterSet):
    __time_filter_choices = (
        ('timed', 'Timed'),
        ('untimed', 'Timeless'),
        ('all', 'All')
    )
    scene_title = r_filters.CharFilter(lookup_expr="icontains")
    timed = r_filters.CharFilter(method="filter_timed")

    class Meta:
        model = Scene
        fields = ['scene_title','timed']

    def filter_timed(self, q_set, name, f_value):
        if f_value == "timed":
            return q_set.exclude(timeframe__tf_start__isnull=True)
        if f_value == 'untimed':
            return q_set.filter(timeframe__tf_start__isnull=True)
        return q_set


class CharacterFilter(r_filters.FilterSet):

    #scene = d_filters.MethodFilter()

    class Meta:
        model = Character
        #fields = ['scene']
        fields = []

    def filter_scene(self, q_set, f_value):
        qs_inc = SceneCharacter.objects.filter(scene__id=f_value)
        inc = qs_inc.values_list('character', flat=True)
        return q_set.filter(id__in=inc)
