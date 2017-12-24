# import json


from scriptus_write.model.story import Scene
from scriptus_write.model.story import TimeFrame
from scriptus_write.model.story import Character
from scriptus_write.model.story import SceneCharacter
from scriptus_write.model.story import Gender

from scriptus_write.rest.serializers import SceneSerializer, VisSerializer
from scriptus_write.rest.serializers import TimeFrameSerializer
from scriptus_write.rest.serializers import CharacterSerializer
from scriptus_write.rest.serializers import CharacterSummarySerializer
from scriptus_write.rest.serializers import GenderSerializer
from scriptus_write.rest.serializers import UserSerializer, GroupSerializer

from scriptus_write.rest.pagers import AllPagesNumbersPagination

from scriptus_write.filters import SceneFilter
from scriptus_write.filters import CharacterFilter

from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from django_filters import rest_framework as filters
from rest_framework.reverse import reverse




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TimeFrameViewSet(viewsets.ModelViewSet):

    queryset = TimeFrame.objects.all().order_by('tf_start')
    serializer_class = TimeFrameSerializer


class SceneViewSet(viewsets.ModelViewSet):

    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    pagination_class = AllPagesNumbersPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = SceneFilter

    @list_route()
    def vis_tl(self, request, timed_filtered=True):
        timed_scenes = Scene.objects.exclude(timeframe__tf_start__isnull=True)

        serializer = VisSerializer(timed_scenes, many=True)
        return Response(serializer.data)

    @detail_route()
    def detailed(self, request, pk=None):
        scene = self.get_object()
        serializer = self.get_serializer(
            scene
        )
        charas = SceneCharacter.objects.filter(
            scene=scene
        )
        ret = serializer.data
        r_url = reverse('character-list',
                        request=request)

        url = "{}?scene={}".format(r_url,
                                   scene.id)

        charDatList = []
        for chara in charas:
            #print(chara.character.chara_whole_name)
            dat = CharacterSummarySerializer(chara.character, context={'request': request}).data
            charDatList.append(dat)
        characters = {'count': len(charas),
                      'url': url,
                      'list': charDatList
                      }

        ret['characters'] = characters
        return Response(ret)


class CharacterViewSet(viewsets.ModelViewSet):

    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = CharacterFilter


class GenderViewSet(viewsets.ModelViewSet):

    queryset = Gender.objects.all()
    serializer_class = GenderSerializer
