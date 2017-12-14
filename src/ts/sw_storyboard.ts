var http = require('http')
console.log('version')
console.log(process.version)

import { StoryBoardManager } from './storyboard/manager'
import * as $ from 'jquery'


var listUrl = $('#scene-service-url').data('url')
var sbManager:StoryBoardManager = new StoryBoardManager(listUrl)
sbManager.initialize()
var scTitleFilterField = $('#scTitleFilterField')
scTitleFilterField.keyup(function() {
  sbManager.filterList(this)
})
