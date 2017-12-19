import * as $ from 'jquery'

import { SweetAlertManager } from '../utils/sweet'

import { SceneService } from '../rest/services'
import { RemoteSceneListResult} from '../rest/services'
import { Scene } from '../model/scene'
import { SceneParameters} from '../rest/json_model'

import { TimeLineManager } from './timeline'

var formatDate = require('../hb/helpers/formatDate')

var swScMainPanel = require('../hb/swScMainPanel.handlebars')
var swScLi = require('../hb/swScLi.handlebars')
var swScTimedDropdown = require('../hb/swScTimedDropdown.handlebars')
var swScPg = require ('../hb/swScPg.handlebars')

/**
* main class for the storyboard
*/
export class StoryBoardManager {

  filterField:string[]
  url:string
  _sweet_mgr:SweetAlertManager
  _sweetMgr:SweetAlertManager //say what ?
  _sceneService:SceneService
  _tlManager:TimeLineManager
  filterMode:SceneParameters

  constructor (serviceUrl) {
    // grunPUBLIC
    this.filterField = null
    this.url = serviceUrl
    this._sweet_mgr = new SweetAlertManager()
    // private
    this._sceneService = new SceneService(serviceUrl)
    this._tlManager = new TimeLineManager(
      serviceUrl + 'all/?timed=timed'
    )
    this._sweetMgr = new SweetAlertManager()
    this.filterMode = {}
  }

   initialize() {
    this._tlManager.refresh_from_server()
    this.refreshList()
  }


  refreshList() {
    this._sceneService.list(this.filterMode).then(
      sceneList => {
        this.redrawSceneList(sceneList)
      }
    )
  }


  __getLabel (timeFilter) {
    switch (timeFilter) {
      case 'timed':
        return 'Timed scenes'
      case 'untimed':
        return 'Timeless scenes'
      default:
        return 'All scenes'
    }
  }


  filterList (element) {
    this.filterField = element
    var value = $(element).val().toLowerCase()
    var threshold = 4
    if (value.length < threshold) {
      delete this.filterMode['scene_title']
      return
    }

    this.filterMode['scene_title'] = value
    delete this.filterMode['page']
    this.refreshList()
    //this.ajax.ajax_list_scenes(
      //this.url,
      //)
      // this.filter_mode)
  }

  getSceneDetail(sceneId:Number) {
    this._sceneService.detail(sceneId).then(this.redrawScene.bind(this))
  }

  redrawScene (sceneObj:Scene) {
    let scene = sceneObj
    // load the panel handlebar template
    var tempScPanel = swScMainPanel
    var html = tempScPanel(scene)
    var timeline = this._tlManager

    // set pannel content with generated template
    $('#sc_main_panel').html(html)

    // When clicked the character count
    // should invoke the character detail panel
    // var liBtn = $('#sc_pl_ch_cnt')
    // var sUrl = liBtn.data('url')
    // li_btn.click( function() {
    //    ajax.chars_for_scene(
    // }
    //	    )

    // zoom on scene in timeline
    // TODO Maybe an event hook ?
    if (scene.timeframe.start) {
      this._tlManager.timeline.fit(scene.id)
      this._tlManager.timeline.setSelection(scene.id)
      let surroundingTime = scene.timeframe.surroundingTime
      this._tlManager.timeline.setWindow(
	surroundingTime.lower,
	surroundingTime.upper
      )
      this._tlManager.timeline.setCurrentTime(scene.timeframe.start)
    } else {
      // picker.data("DateTimePicker").date(d_time)
      this.__setupDtPicker(scene)
    }
  }

  __setupDtPicker (scene) {
    var dTime = this._tlManager.timeline.getCurrentTime()
    var __this = this
    var elDtp = $('#sc_datetimepicker')
    var picker = $('#sc_datetimepicker').datetimepicker({
      sideBySide: true,
      defaultDate: dTime,
      locale: navigator.language
    })
    picker.on('dp.change', function (e) {
      // e.date is a moment object

      __this.__sceneUpdateAlert(e, scene)
    }
 )
  }

  __sceneUpdateAlert (event, scene) {
    var title = 'Update scene ' + scene.title + ' ?'
    var text = 'Do you really want to update scene ?'
    scene.start = event.date.toJSON()
    this._sweet_mgr.prettyConfirm(
      title,
      text,
      'update',
      scene,
      this._scUpdateHook.bind(this)
    )
  }

  _scUpdateHook (event, properties) {
    // var dt = properties
    // this.ajax.ajax_update_scene(dt, this.init.bind(this))
  }

  _tlUpdateHook (event, properties) {
    /* var dt = properties.data[0]
    dt.timeframe.tf_start = dt.start
    dt.timeframe.tf_end = dt.end
    this.ajax.ajax_update_scene(dt,
				this.init.bind(this))
     */
  }

  redrawSceneList (sceneList:RemoteSceneListResult) {
    let scenes:Scene[] = sceneList.scenes
    //let pages = sceneList.result.links
    var sceneItemTmpl = swScLi

    // fetching the container for the list
    var container = $('#scene_list')

    // will be used in nested functions
    var __this = this

    // clear previous list
    $('.sw_scene_item').each(
      function () {
        $(this).remove()
      }
    )

    var firstItem = undefined

    /*
     Init buttons
     What we want to do here is :
     * Load the compiled handlebars template
     * Get the current mode
     * Add events to the buttons
     */
    var buttonsTemplate = swScTimedDropdown
    var buttonsContext = {
      'current_action': this.__getLabel(
	       this.filterMode['timed']
      )
    }
    var buttons = $(buttonsTemplate(buttonsContext))
    var btLi = $('#sw_sc_buttons')
    btLi.html(buttons)
    var fMode:SceneParameters = this.filterMode

    // adding behaviour
    var btFilters = btLi.find('.sc-filter-mode')
    btFilters.each(
      function () {
	// ask to redraw list on filter
	// binding to this guarantees that the context
	// will be the story board manager
        $(this).click(
          function () {
 // each button contains a data-mode attribute
            var mode = $(this).data('mode')
            if (mode) {
              __this.filterMode['timed'] = mode
            } else {
      // except for one, which is default status
              delete __this.filterMode['timed']
            }
            // the result count can be modified, and so the page may be undefined
            delete __this.filterMode.page

  // actual call to the ajax service
          __this.refreshList()
          }
	       )
      }
    )
     /*
     Initiating pager
     Our scene requests are paged, pages should
     be profided for comfort purpose
     * load handlebar template
     * apply json context
     * add behaviour to pager links
     */
    var pagerTemplate = swScPg
    var pager = $(pagerTemplate(sceneList))
    var pgUl = $('#sw_sc_pager')
    pgUl.html(pager)
    var ctrls = pgUl.find('.sw_sc_pg_ctrl')
    // adding behaviour on click
    ctrls.each(
      function () {
	// links are generated with a data-url attribute
	// this attribute is provided by the rest service
	// as scene.url
        $(this).click(
          function () {
            let page = $(this).data('page')
            __this.filterMode['page'] = page

            __this.refreshList()
	         }
	        )
      }
    )

    /*
     Initiating scenes
     For each scene we will apply its json content to a handlebars template
     */
    for (var scene of scenes) {
      var item = $(sceneItemTmpl(scene))
      item.scene = scene
      container.append(item)
      if (firstItem === undefined && scene.timeframe) {
        firstItem = item
      }
      // on click on an item in the list
      // we want to look for this specific scene
      // and display it in the right pannel
      item.click(
       function () {
         __this.getSceneDetail(this.dataset.scid)
	    }
      )
    }

    // provides a callback for the manager in case of update
    this._tlManager.update_hook = this._tlUpdateHook.bind(this)

    // try to display the first item anyway
    if (firstItem) {
      firstItem.click()
    }
  }



}
