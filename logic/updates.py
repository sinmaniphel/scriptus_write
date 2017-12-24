'''
Here we will handle all the data saving logic
'''
from scriptus_write.model.story import Story, Scene
from scriptus_write.model.revision import RevisionScenes, Revision
from scriptus_write.utils.fsmanager import ScriptusFsProject

class SceneUpdater:



    def new_scene(scene) {
        # saving the scene
        scene.save()

        # adding the scene to current revision
        rev_scenes = new RevisionScenes()
        rev_scenes.revision = self.current_revision
        rev_scenes.scene = scene
        rev_scenes.save()

    }
