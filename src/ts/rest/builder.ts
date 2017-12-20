/**
methods in this package are used to convert jSon objects to sw model objects.
The reason why we do that is that we want to separate how data is handled (jSon)
from how it is presented via the tool (model)
*/

import * as json from './json_model'

import { Scene } from '../model/scene'
import { Character } from '../model/character'
import * as com from '../model/common'


export function buildScene(jScene:json.JsonScene):Scene {
  var scRet:Scene = new Scene(jScene.id, jScene.scene_title)
  scRet.content = jScene.content
  scRet.description = jScene.description
  scRet.status = jScene.status

  // add characters
  if(jScene.characters && jScene.characters.count > 0) {
    scRet.characters = []
    for(let jChar of jScene.characters.list)
    {
      var char:Character = buildCharacter(jChar)
      scRet.characters.push(char)
    }

  }

  // add timeframe
  if(jScene.timeframe) {
    scRet.timeframe = buildTimeFrame(jScene.timeframe)
  }

  return scRet
}

export function buildCharacter(jChar:json.JsonCharacter):Character {
  var chRet:Character = new Character(jChar.chara_whole_name, jChar.chara_gender.id)
  chRet.description = jChar.description
  return chRet
}

export function buildTimeFrame(jsTf:json.JsonTimeframe):com.TimeFrame {
  var tf:com.TimeFrame = new com.TimeFrame(jsTf.tf_start, jsTf.tf_end)
  return tf
}
