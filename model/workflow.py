from django.db import models
from .story import Story
from .story import Described
from django.contrib.auth.models import User


'''
So, this should be about versionning
A revision should refer to
* a git branch
* a story
* some versionned items such as Scenes or characters

'''
class Revision(models.Model):

    gitBranch = models.CharField(max_length=1024)
    purpose = models.TextField()
    creator = models.ForeignKey(
            User
        )

    story = models.ForeignKey(
        Story,
        on_delete=models.PROTECT
        )

class RevisionScenes(models.Model):
    revision = models.ForeignKey(
        Revision,
        on_delete=models.CASCADE
        )
    scene = models.ForeignKey(
        Scene,
        on_delete=models.CASCADE
    )
