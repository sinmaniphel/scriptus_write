from django.db import models

# Create your models here.


class Story(models.Model):
    base_uri = models.CharField(max_length=1024)
    title = models.CharField(max_length=1024)
    shortname = models.CharField(max_length=64)

    def __str__(self):
        return self.title


class StoryBased(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class TimeFrame(models.Model):
    tf_name = models.CharField(max_length=512)
    tf_start = models.DateTimeField(null=True)
    tf_end = models.DateTimeField(null=True)

    def __str__(self):
        return self.tf_name

class FramedInTime(models.Model):
    timeframe = models.ForeignKey(
        TimeFrame,
        related_name='%(class)s_fit_related',
        on_delete=models.PROTECT)

    class Meta:
        abstract = True


class Annotated(models.Model):
    '''
    An abstract class which describes an annotated object.
    As such, an Annotated has a "notes" attributes which is a Content
    '''

    notes = models.TextField()
    class Meta:
        abstract = True


class Described(models.Model):
    '''
    A described object is an object which has both
    notes attached and a description
    '''

    description = models.TextField()
    
    class Meta:
        abstract = True


class Statused(models.Model):
    STATUS_LIST = (
        (1, "Started"),
        (2, "Draft"),
        (3, "Work In Progress"),
        (4, "Beta"),
        (5, "Done")
    )
    status = models.IntegerField(choices=STATUS_LIST)

    class Meta:
        abstract = True


class Attribute(StoryBased):
    att_key = models.CharField(max_length=256)
    att_value = models.CharField(max_length=2048)


class Chapter(Annotated, Described):
    chap_no = models.IntegerField()
    chap_title = models.CharField(max_length=256)

    def __str__(self):
        return self.chap_title


class Gender(StoryBased):
    gender_name = models.CharField(max_length=32)

    def __str__(self):
        return self.gender_name


class Idea(StoryBased, Annotated, Statused):
    idea_name = models.CharField(max_length=1024)

    def __str__(self):
        return self.idea_name


class Occupation(StoryBased, Annotated, Described):
    occ_name = models.CharField(max_length=1024)

    def __str__(self):
        return self.occ_name


class Character(StoryBased, Annotated, Described, FramedInTime):

    chara_whole_name = models.CharField(max_length=512)
    chara_nickname = models.CharField(max_length=32)
    chara_gender = models.ForeignKey(Gender, on_delete=models.PROTECT)

    def __str__(self):
        return self.chara_whole_name


class Location(StoryBased, Annotated, Described, FramedInTime):

    loc_name = models.CharField(max_length=128)
    loc_latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True)
    loc_longitude = models.DecimalField(max_digits=9,
                                        decimal_places=6,
                                        null=True)
    loc_altitude = models.IntegerField(null=True)

    def __str__(self):
        return self.loc_name


class Artifact(StoryBased, Annotated, Described):

    art_name = models.CharField(max_length=512)

    def __str__(self):
        return self.art_name


class Strand(StoryBased, Annotated, Described):
    strand_name = models.CharField(max_length=512)

    def __str__(self):
        return self.strand_name


class Scene(StoryBased, Annotated, Described, FramedInTime, Statused):
    scene_title = models.CharField(max_length=512)

    # scene_location = models.ForeignKey(Location, on_delete=models.PROTECT)
    scene_mainstrand = models.ForeignKey(Strand, on_delete=models.PROTECT)

    def __str__(self):
        return self.scene_title


class SceneFrame(models.Model):
    '''
    This one is a bit tricky.
    Some time frames would be described by a start scene and an end scene
    That's what I call a SceneFrame
    '''
    sf_name = models.CharField(max_length=512)
    sf_start_scene = models.ForeignKey(
        Scene, related_name='sc_frame_start_related', on_delete=models.CASCADE)
    sf_end_scene = models.ForeignKey(
        Scene, related_name='sc_frame_end_related', on_delete=models.CASCADE)


class Part(Annotated):
    part_name = models.CharField(max_length=512)
    part_number = models.IntegerField()

'''
Associations
'''


class CharacterOccupation(Annotated, FramedInTime):

    cocc_character = models.ForeignKey(Character, on_delete=models.CASCADE)
    cocc_occupation = models.ForeignKey(Occupation, on_delete=models.CASCADE)


class Relationship(Annotated, Described):
    rel_char1 = models.ForeignKey(Character,
                                  related_name="char1_related",
                                  on_delete=models.CASCADE)
    rel_char2 = models.ForeignKey(Character,
                                  related_name="char2_related",
                                  on_delete=models.CASCADE)
    rel_scene_frame = models.ForeignKey(SceneFrame,
                                        null=True,
                                        on_delete=models.SET_NULL)


class SceneCharacter(models.Model):
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)


class SceneStrand(models.Model):
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE)
    strand = models.ForeignKey(Strand, on_delete=models.CASCADE)


class SceneLocation(models.Model):
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
