from django.contrib.auth.models import User, Group
from rest_framework import serializers

from scriptus_write.utils import fsmanager

from scriptus_write.models import Scene
from scriptus_write.models import Content
from scriptus_write.models import TimeFrame
from scriptus_write.models import Character
from scriptus_write.models import SceneCharacter
from scriptus_write.models import Gender

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


class TimeFrameSerializer(serializers.HyperlinkedModelSerializer):


    class Meta:
        model = TimeFrame
        fields = '__all__'


class GenderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gender
        exclude = ('story','id')


class CharacterSerializer(serializers.HyperlinkedModelSerializer):

    description = serializers.SerializerMethodField()
    chara_gender = GenderSerializer()

    class Meta:
        model = Character
        fields = ('description', 'chara_whole_name',
                  'chara_nickname', 'chara_gender')

    def get_description(self, obj):
        try:
            obj.description
        #story = obj.story
        # fs = fsmanager.ScriptusFsProject(story.base_uri)
        except AttributeError:
            return ""
        else:
            return fsmanager.get_string_content(obj.description)

class CharacterSummarySerializer(serializers.ModelSerializer):
    chara_gender = GenderSerializer
    class Meta:
        model = Character
        fields = ['chara_whole_name','chara_gender']

class SceneSerializer(serializers.HyperlinkedModelSerializer):

    description = serializers.SerializerMethodField()
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()
    dt_start = serializers.SerializerMethodField()
    dt_end = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    timeframe = TimeFrameSerializer()
    # scene_detail = serializers.HyperlinkedRelatedField(
    #   view_name='scene_detail', read_only=True)

    class Meta:
        model = Scene
        fields = ('url', 'id', 'scene_title', 'description', 'start',
                  'end', 'dt_start', 'dt_end', 'content', 'status',
                  'timeframe')

    def update(self, scene, validated_data):
        print(validated_data)
        if 'timeframe' in validated_data:
            tf = validated_data.pop('timeframe')
            self.__update_time_frame(scene.timeframe,
                                     tf)
        Scene.objects.filter(pk=scene.id).update(**validated_data)
        return scene

    def __update_time_frame(self, timeframe, v_tf):
        if 'tf_start' in v_tf:
            timeframe.tf_start = v_tf['tf_start']
        if 'tf_end' in v_tf:
            timeframe.tf_end = v_tf['tf_end']
        if timeframe.tf_end is None:
            timeframe.tf_end = timeframe.tf_start + dt.timedelta(0,
                                                                 3600)
        timeframe.save()

    def get_description(self, obj):
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
