from django.contrib import admin

from .models import Gender, Character, Location, Artifact, Scene, TimeFrame, Idea, Content, Story, SceneCharacter

admin.site.register(TimeFrame)
admin.site.register(Gender)
admin.site.register(Character)
admin.site.register(Location)
admin.site.register(Artifact)
admin.site.register(Scene)
admin.site.register(Idea)
admin.site.register(Content)
admin.site.register(Story)
admin.site.register(SceneCharacter)
# Register your models here.
