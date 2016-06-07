from django.contrib.auth.models import User, Group
from rest_framework import serializers

from scriptus_write.utils import fsmanager

from scriptus_write.models import Scene
from scriptus_write.models import Content

import datetime as dt

__one_hour_dt = dt.timedelta(0, 3600)


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('url', 'name')


class ContentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Content


class SceneSerializer(serializers.HyperlinkedModelSerializer):

    description = serializers.SerializerMethodField()
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()
    dt_start = serializers.SerializerMethodField()
    dt_end = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    # scene_detail = serializers.HyperlinkedRelatedField(
    #   view_name='scene_detail', read_only=True)

    class Meta:
        model = Scene
        fields = ('url', 'id', 'scene_title', 'description', 'start',
                  'end', 'dt_start', 'dt_end', 'content')

    def get_description(self, obj):
        #story = obj.story
        # fs = fsmanager.ScriptusFsProject(story.base_uri)
        return fsmanager.get_string_content(obj.description)

    def get_start(self, obj):
        return obj.timeframe.tf_start

    def get_content(self, obj):
        return obj.scene_title

    def get_end(self, obj):
        return obj.timeframe.tf_end

    def get_dt_start(self, obj):
        if obj.timeframe.tf_start is None:
            return None
        return obj.timeframe.tf_start.date()

    def get_dt_end(self, obj):
        if obj.timeframe.tf_start is None:
            return None
        return obj.timeframe.tf_start.date() + dt.timedelta(1)
