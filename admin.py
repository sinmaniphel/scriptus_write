from django.contrib import admin
from reversion.admin import VersionAdmin

from .model.story import Gender, Character, Location, Artifact, Scene, TimeFrame, Idea, Content, Story, SceneCharacter

@admin.register(TimeFrame)
class TimeFrameAdmin(VersionAdmin):
    pass

@admin.register(Character)
class CharacterAdmin(VersionAdmin):
    pass

@admin.register(Location)
class LocationAdmin(VersionAdmin):
    pass

@admin.register(Artifact)
class ArtifactAdmin(VersionAdmin):
    pass

@admin.register(Scene)
class SceneAdmin(VersionAdmin):
    pass

@admin.register(Idea)
class IdeaAdmin(VersionAdmin):
    pass

@admin.register(Story)
class StoryAdmin(VersionAdmin):
    pass

@admin.register(SceneCharacter)
class SceneCharacterAdmin(VersionAdmin):
    pass

admin.site.register(Gender)
