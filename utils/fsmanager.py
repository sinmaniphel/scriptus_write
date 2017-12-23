from django.contrib.auth.models import User
from django.conf import settings
from enum import Enum
from dulwich.repo import Repo
import os


def get_string_content(content):
    f_content = open(content.cont_url, 'r')
    return f_content.read()


class ScriptusFSException(Exception):

    def __init__(self, message):
        self.message = message


class EFileType(Enum):
    PROJECT = 1
    CONTENT = 2
    NOTE = 3
    EPUB = 4


class ScriptusFsProject:

    def create_from_name(proj_name, mk_dir=True):
        s_root = settings.SCRIPTUS_WRITER_ROOT
        s_proj_root = os.path.join(s_root, proj_name)
        if mk_dir is True:
            if not os.path.exists(s_proj_root):
                os.makedirs(s_proj_root)
        # initializing the project as a git repo
        repo = Repo.init(s_proj_root)
        project = ScriptusFsProject(s_proj_root)
        project.init()
        return project

    def __init__(self, f_root):
        self.project_root = f_root
        self._injoin = lambda f: os.path.join(f_root, f)
        self._join = lambda f1, f2: os.path.join(f1, f2)

        self.repo = Repo(self.project_root)

        self.chapters = self._injoin("chapter")
        self.ideas = self._injoin("idea")
        self.occupations = self._injoin("occupation")
        self.characters = self._injoin("character")
        self.locations = self._injoin("location")
        self.artifacts = self._injoin("artifact")
        self.strands = self._injoin("strand")
        self.scenes = self._injoin("scene")

    def exists(self):
        return os.path.exists(self.project_root)

    def init(self):

        all_items = [self.chapters,
                     self.ideas,
                     self.occupations,
                     self.characters,
                     self.locations,
                     self.artifacts,
                     self.strands,
                     self.scenes]
        for item in all_items:
            os.mkdir(item)
            os.mkdir(self._join(item, "note"))
            os.mkdir(self._join(item, "description"))

    def _get_target_files(self, f_parent, name):
        notes = self._join(f_parent, "note")
        descs = self._join(f_parent, "description")
        f_note = self._join(notes, name)
        f_desc = self._join(descs, name)
        return f_note, f_desc

    def get_chapter(self, name):
        return self._get_target_files(self.chapters, name)

    def get_idea(self, name):
        return self._get_target_files(self.ideas, name)

    def get_occupation(self, name):
        return self._get_target_files(self.occupations, name)

    def get_character(self, name):
        return self._get_target_files(self.characters, name)

    def get_location(self, name):
        return self._get_target_files(self.locations, name)

    def get_artifact(self, name):
        return self._get_target_files(self.artifacts, name)

    def get_strand(self, name):
        return self._get_target_files(self.strands, name)

    def get_scene(self, name):
        return self._get_target_files(self.scenes, name)

    def save_file(self, f_target, content):
        with open(f_target, "w") as target:
            target.write(content)

    def stage_file(self, f_target, comment):
        self.repo
