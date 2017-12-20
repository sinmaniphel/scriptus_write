import * as $ from 'jquery'

import { CharacterService } from '../rest/services'
import { Character } from '../model/character'

var chListTpl = require('../hb/ch/swChList')

export class CharacterManager {

    service:CharacterService

    constructor() {
      this.service = new CharacterService('/scriptus/write/rest/characters')

    }

    initialize() {
      this.refreshList()
    }

    refreshList() {
      this.service.list().then(
        (characters) => {
          this.redrawList(characters)
        }
      )
    }

    redrawList(characters:Character[]) {
      console.log(characters)
      let panel = $('#swChList')
      console.log(panel)
      let htmlList = chListTpl({character:characters})
      console.log(htmlList)
      panel.html(htmlList)
    }



}
