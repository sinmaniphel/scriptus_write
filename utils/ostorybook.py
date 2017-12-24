import scriptus_write.model.story as mods
import sqlite3
import tempfile
import shutil
import logging
import datetime as dt
#from .fsmanager import ScriptusFsProject
# from django.utils import text as dtu


logger = logging.getLogger(__name__)


def handle_uploaded_db_file(dbfile):
    '''
    Django tipycally handles a file in memory
    and we need an url for the sqlite3 driver
    '''

    local_file = tempfile.NamedTemporaryFile()
    shutil.copyfileobj(dbfile, local_file)
    return local_file


class OStoryBookModel:

    def __init__(self):
        self.timeframes = []
        self.characters = []
        self.genders = []
        self.ideas = []


class OStoryBookLoader:

    def __init__(self):
        self.__connection = None

    def import_from_sqlite(self, sqlite_dbfile, pname):
        tmp_dbfile = handle_uploaded_db_file(sqlite_dbfile)
        dburl = tmp_dbfile.name
        self.__connection = sqlite3.connect(
            dburl,
            detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        self.__connection.row_factory = sqlite3.Row



        self.story = mods.Story(
            title=pname,
            shortname=pname)
        self.story.save()

        self.characters = self.import_characters()
        self.attributes = self.import_attributes()
        self.chapters = self.import_chapters()
        self.ideas = self.import_ideas()
#        occupations = self.import_occupations()
        self.locations = self.import_locations()
        self.artifacts = self.import_artifacts()
        self.strands = self.import_strands()
        self.scenes = self.import_scenes()

        self.import_scene_character()
        self.import_scene_location()
        self.import_scene_strand()

        self.__connection.close()
        return self

    def clean_content(self,text):
        return text.replace('\\n','')

    # def _create_content(self,
    #                     obj,
    #                     objname,
    #                     call_func,
    #                     notes,
    #                     description):
    #     f_notes, f_description = call_func(objname)
    #     self.__filesystem.save_file(f_notes,
    #
    #                                 )
    #     self.__filesystem.save_file(f_description,
    #                                 description.replace('\\n', ''))
    #
    #     obj.description = self._new_content(f_description, objname)
    #     obj.notes = self._new_content(f_notes, objname)

    def import_artifacts(self):
        c_arts = self.__connection.cursor()
        query = "Select ID,NAME, DESCRIPTION, NOTES from TAG"
        l_arts = {}

        r_arts = c_arts.execute(query)
        for r_artifact in r_arts:
            artifact = mods.Artifact()
            artifact.story = self.story
            artifact.art_name = r_artifact['NAME']
            s_art_desc = r_artifact['DESCRIPTION']
            s_art_note = r_artifact['NOTES']
            artifact.description = self.clean_content(s_art_desc)
            artifact.notes = self.clean_content(s_art_note)

            l_arts[r_artifact['ID']] = artifact
            artifact.save()
        c_arts.close()
        return l_arts

    def import_attributes(self):
        pass

    def import_chapters(self):
        c_chap = self.__connection.cursor()
        query = "Select CHAPTERNO, TITLE, DESCRIPTION, NOTES from CHAPTER"
        l_chaps = []

        r_chaps = c_chap.execute(query)
        for r_chapter in r_chaps:
            chapter = mods.Chapter()
            chapter.story = self.story
            chapter.chap_no = r_chapter['CHAPTERNO']
            chapter.chap_title = r_chapter['TITLE']
            name = "{}#{}".format(chapter.chap_no,
                                  chapter.chap_title)
            s_chap_desc = r_chapter['DESCRIPTION']
            s_chap_note = r_chapter['NOTES']
            chapter.description = self.clean_content(s_chap_desc)
            chapter.note = self.clean_content(s_chap_note)
            l_chaps.append(chapter)
            chapter.save()
        c_chap.close()
        return l_chaps

    def import_characters(self):
        # We start by importing the genders
        genders = self._import_genders()
        c_char = self.__connection.cursor()
        chars = {}
        r_chars = c_char.execute(
            "Select * from PERSON")
        i = 0
        for r_char in r_chars:
            char = mods.Character()
            char.story = self.story
            tframe = mods.TimeFrame()

            s_charname = r_char['ABBREVIATION']
            s_tf_name = "{}-{}".format(s_charname, i)

            tframe.tf_name = s_tf_name
            tframe.tf_start = r_char['BIRTHDAY']
            tframe.tf_end = r_char['DAYOFDEATH']
            tframe.save()
            char.timeframe = tframe

            gen_id = int(r_char['GENDER_ID'])
            logger.info(genders[gen_id])
            char.chara_gender = genders[gen_id]

            char.chara_whole_name = "{} {}".format(
                r_char['FIRSTNAME'],
                r_char['LASTNAME'])

            nickname = r_char['ABBREVIATION']
            char.chara_nickname = nickname

            notes = r_char['NOTES']
            description = r_char['DESCRIPTION']

            char.notes = self.clean_content(notes)
            char.description = self.clean_content(description)
            chars[r_char['ID']] = char
            char.save()
            i = i + 1
        # closing the cursor
        c_char.close()
        return chars


    def _import_genders(self):
        c_gender = self.__connection.cursor()
        r_gens = c_gender.execute("Select ID, NAME from GENDER").fetchall()
        d_gens = {}
        for r_gen in r_gens:
            s_name = r_gen['NAME']
            gender = mods.Gender(gender_name=s_name)
            gender.story = self.story
            gen_id = int(r_gen['ID'])
            d_gens[gen_id] = gender
            gender.save()
        # now be a good boy and close that cursor
        c_gender.close()
        return d_gens

    def import_ideas(self):
        c_idea = self.__connection.cursor()
        query = "Select ID,STATUS, NOTE from IDEAS"
        l_ideas = []

        r_ideas = c_idea.execute(query)
        for r_idea in r_ideas:
            idea = mods.Idea()
            idea.story = self.story
            idea.status = r_idea['STATUS']
            name = "{}#{}".format("idea",
                                  r_idea['ID'])
            s_idea_desc = ""
            s_idea_note = r_idea['NOTE']
            idea.notes = self.clean_content(s_idea_note)
            idea.description = s_idea_desc
            l_ideas.append(idea)
            idea.save()
        c_idea.close()
        return l_ideas

    def _add_loc_time_frame(self, location, int_id):
        tf = mods.TimeFrame(
            tf_name="location_tf#{}".format(int_id)
        )
        date_now = dt.datetime.utcnow()
        thsd_years = dt.timedelta(365000)
        tf.tf_start = date_now - thsd_years
        tf.tf_end = date_now + thsd_years
        tf.save()
        location.timeframe = tf

    def _add_scene_time_frame(self, scene, timestamp, int_id):
        tf = mods.TimeFrame(tf_name="scene_tf#{}".format(int_id))
        # adding one hour
        if timestamp is not None:
            end_date = timestamp + dt.timedelta(0, 3600)
            tf.tf_start = timestamp
            tf.tf_end = end_date
        tf.save()
        scene.timeframe = tf

    def import_locations(self):
        c_location = self.__connection.cursor()
        query = "Select ID, NAME, ALTITUDE, DESCRIPTION, NOTES from LOCATION"
        l_locations = {}

        r_locations = c_location.execute(query)
        for r_location in r_locations:
            location = mods.Location()
            location.story = self.story
            loc_id = r_location['ID']
            location.loc_name = r_location['NAME']
            location.loc_altitude = r_location['ALTITUDE']
            location.loc_latitude = 0
            location.loc_longitude = 0
            s_location_desc = r_location['DESCRIPTION']
            s_location_note = r_location['NOTES']
            location.description = self.clean_content(s_location_desc)
            location.notes = self.clean_content(s_location_note)
            self._add_loc_time_frame(location, loc_id)
            l_locations[r_location['ID']] = location
            location.save()
        c_location.close()
        return l_locations

    def import_scenes(self):
        c_scene = self.__connection.cursor()
        query = "Select ID, TITLE, SCENE_TS, STRAND_ID, SUMMARY, STATUS,  NOTES from SCENE"
        l_scenes = {}

        r_scenes = c_scene.execute(query)
        for r_scene in r_scenes:
            scene = mods.Scene()
            scene.story = self.story
            scene.status = 1
            scene.scene_title = r_scene['TITLE']
            scene.scene_mainstrand = self.strands[r_scene['STRAND_ID']]
            s_scene_desc = r_scene['SUMMARY']
            s_scene_note = r_scene['NOTES']
            i_scene_id = r_scene['ID']
            scene.notes = self.clean_content(s_scene_note)
            scene.description = self.clean_content(s_scene_desc)
            d_time = r_scene['SCENE_TS']

            self._add_scene_time_frame(scene, d_time, i_scene_id)
            l_scenes[i_scene_id] = scene
            scene.save()
        c_scene.close()
        return l_scenes

    def import_strands(self):
        c_strand = self.__connection.cursor()
        query = "Select ID, NAME, ABBREVIATION, NOTES from STRAND"
        l_strands = {}

        r_strands = c_strand.execute(query)
        for r_strand in r_strands:
            strand = mods.Strand()
            strand.story = self.story
            strand.strand_name = r_strand['NAME']

            s_strand_note = r_strand['NOTES']
            strand.notes = self.clean_content(s_strand_note)
            strand.desc = ""
            l_strands[r_strand['ID']] = strand
            strand.save()
        c_strand.close()
        return l_strands

    def import_timeframes(self):
        # Are concerned by timeframes :
        # Characters
        # Location
        # Scene
        # CharacterOccupatio        return timeframes
        pass

    # -----------------------------------------
    # ASSOCIATIONS
    # -----------------------------------------

    def import_character_occupation(self):
        pass

    def import_scene_character(self):
        c_scechar = self.__connection.cursor()
        query = "Select SCENE_ID, PERSON_ID from SCENE_PERSON"
        l_scechars = []

        r_scechars = c_scechar.execute(query)
        for r_scechar in r_scechars:
            i_scene = r_scechar['SCENE_ID']
            i_char = r_scechar['PERSON_ID']
            o_scene = self.scenes[i_scene]
            o_char = self.characters[i_char]
            scechar = mods.SceneCharacter(scene=o_scene,
                                          character=o_char)
            l_scechars.append(scechar)
            scechar.save()

        c_scechar.close()
        return l_scechars

    def import_relationship(self):
        c_rela = self.__connection.cursor()
        query = "Select PERSON1_ID, PERSON2_ID from RELATIONSHIP"
        l_relas = []

        r_relas = c_rela.execute(query)
        for r_rela in r_relas:
            i_char1 = r_rela['PERSON1_ID']
            i_char2 = r_rela['PERSON2_ID']
            o_char1 = self.characters[i_char1]
            o_char2 = self.characters[i_char2]
            rela = mods.Relationship(rel_char1=o_char1,
                                     rel_char2=o_char2)
            l_relas.append(rela)
            rela.save()

        c_rela.close()
        return l_relas

    def import_scene_strand(self):
        c_rela = self.__connection.cursor()
        query = "Select SCENE_ID, STRAND_ID from SCENE_STRAND"
        l_relas = []

        r_relas = c_rela.execute(query)
        for r_rela in r_relas:
            i_scene = r_rela['SCENE_ID']
            i_strand = r_rela['STRAND_ID']
            o_rel1 = self.scenes[i_scene]
            o_rel2 = self.strands[i_strand]
            rela = mods.SceneStrand(scene=o_rel1,
                                    strand=o_rel2)
            l_relas.append(rela)
            rela.save()

        c_rela.close()
        return l_relas

    def import_scene_location(self):
        c_rela = self.__connection.cursor()
        query = "Select SCENE_ID, LOCATION_ID from SCENE_LOCATION"
        l_relas = []

        r_relas = c_rela.execute(query)
        for r_rela in r_relas:
            i_scene = r_rela['SCENE_ID']
            i_loc = r_rela['LOCATION_ID']
            o_rel1 = self.scenes[i_scene]
            o_rel2 = self.locations[i_loc]
            rela = mods.SceneLocation(scene=o_rel1,
                                      location=o_rel2)
            l_relas.append(rela)
            rela.save()

        c_rela.close()
        return l_relas

    def _list_char_tf(self):
        pass

    def _list_loc_tf(self):
        pass

    def _list_sc_tf(self):
        pass


class OStoryBookInterface:

    def __init__(self):
        self.__importer = OStoryBookLoader()
