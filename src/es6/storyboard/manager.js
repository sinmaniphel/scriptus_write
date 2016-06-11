//import * as $ from 'static/vendor/jquery/dist/jquery.js';
//import 'babel-polyfill'

import { SweetAlertManager } from '../utils/sweet';
import {SWDjangoUtils} from '../utils/django';

import { StoryBoardAjax } from './sb_ajax';
import {TimeLineManager} from './timeline';

import sw_sc_main_pannel from '../hb/sw_sc_main_pannel.handlebars';
import sw_sc_li from '../hb/sw_sc_li.handlebars';
import sw_sc_timed_dropdown from '../hb/sw_sc_timed_dropdown.handlebars';
import sw_sc_pg from '../hb/sw_sc_pg.handlebars';

//ScriptusTemplates = {};
//console.log(Handlebars);

export default class StoryBoardManager{


    constructor(service_url) {
	// PUBLIC
	this.ajax = new StoryBoardAjax();
	this.filter_field = null;
	this.url = service_url;
	this._sweet_mgr = new SweetAlertManager();
	// private
	this._tl_manager = new TimeLineManager(
	    service_url + 'all/?timed=timed'
	);
	this._sw_utils = new SWDjangoUtils();
	this._sweet_mgr = new SweetAlertManager();
//	HandlebarsIntl.registerWith(Handlebars);
	this.filter_mode = {};

    }
    
    __get_label(time_filter) {
	switch (time_filter) {
	case 'timed':
	    return 'Timed scenes';
	case 'untimed':
	    return 'Timeless scenes';
	default:
	    return 'All scenes';
	}
	
    }
    

    filter_list( element )
    {
	this.filter_field = element;
	var value = $(element).val().toLowerCase();
	var threshold = 4;
	if (value.length < threshold)
	{
	    delete this.filter_mode['scene_title']
	    return;
	}

	this.filter_mode['scene_title'] = value;
	this.ajax.ajax_list_scenes(
	    this.url,
	    this.redraw_scene_list.bind(this),
	    this.filter_mode);
    }

    
    redraw_scene( json )
    {

	// load the panel handlebar template
	var temp_sc_panel = sw_sc_main_pannel
	var html = temp_sc_panel(json);
	var timeline = this.timeline

	// set pannel content with generated template
	$('#sc_main_panel').html(html);

	// When clicked the character count
	// should invoke the character detail panel
	
	var li_btn = $('#sc_pl_ch_cnt');
	var s_url = li_btn.data('url');
	//li_btn.click( function() {
	//    ajax.chars_for_scene(
	//}
	//	    )

	// zoom on scene in timeline
	// TODO Maybe an event hook ?
	if ( json['start'] ) {
	    this._tl_manager.timeline.fit(json['id']);
	    this._tl_manager.timeline.setSelection(json['id']);
	    this._tl_manager.timeline.setWindow(
		json['dt_start'], json['dt_end']
	    );
	    this._tl_manager.timeline.setCurrentTime(json.start);
	   
	}
	else {
	    // picker.data("DateTimePicker").date(d_time);
	    this.__setup_dt_picker(json);
	}

    }

    __setup_dt_picker(json) {
	var d_time = this._tl_manager.timeline.getCurrentTime();
	var __this = this;
	var picker = $('#sc_datetimepicker').datetimepicker({
	    sideBySide: true,
	    defaultDate: d_time,
	    locale: navigator.language
	});
	picker.on('dp.change', function(e) {
	    // e.date is a moment object

	    __this.__scene_update_alert(e, json)
	}
		 )

    }

    __scene_update_alert(event, json) {
	var title = 'Update scene ' + json.scene_title + ' ?';
	var text = 'Do you really want to update scene ?';
	json.timeframe.tf_start = event.date.toJSON();
	this._sweet_mgr.prettyConfirm(
	    title,
	    text,
	    'update',
	    json,
	    this._sc_update_hook.bind(this)
	)
	;
	    
	
    }

    _sc_update_hook(event, properties) {
	var dt = properties;
	this.ajax.ajax_update_scene(dt, this.init.bind(this))
    }

    _tl_update_hook(event, properties) {
	var dt = properties.data[0];
	dt.timeframe.tf_start = dt.start;
	dt.timeframe.tf_end = dt.end;
	this.ajax.ajax_update_scene(dt,
				    this.init.bind(this));
    }


    redraw_scene_list(json)
    {

	var scene_item_tmpl = sw_sc_li;

	// fetching the container for the list
	var container = $('#scene_list');

	// will be used in nested functions
	var __this = this;

	// shortcut and reference
	var ajax = this.ajax;

	// clear previous list
	$('.sw_scene_item').each(
	    function() {
		$(this).remove();
	    }
	);

	var first_item = undefined;

	/*
	  Init buttons
	  What we want to do here is :
	  * Load the compiled handlebars template
	  * Get the current mode
	  * Add events to the buttons
	 */
	var buttons_template = sw_sc_timed_dropdown
	var buttons_context = {'current_action': this.__get_label
			       (
				   this.filter_mode['timed']
			       )
			      };
	var buttons = $(buttons_template(buttons_context));
	var bt_li = $('#sw_sc_buttons');
	bt_li.html(buttons);
	var f_mode = this.filter_mode;
	
	// adding behaviour
	var bt_filters = bt_li.find('.sc-filter-mode');
	bt_filters.each(
	    function() {
		// ask to redraw list on filter
		// binding to this guarantees that the context
		// will be the story board manager
		var handler_func = __this.redraw_scene_list.bind(__this);
		$(this).click(
		    
		    function() {
			// each button contains a data-mode attribute
			var mode = $(this).data('mode');
		
			if ( mode ) {
			    f_mode['timed'] = mode;
			}
			else {
			    // except for one, which is default status
			    delete f_mode['timed'];
			}
			// actual call to the ajax service
			ajax.ajax_list_scenes(__this.url, handler_func, f_mode);
					  
		    }
		)
	    }
	);
	
		
	/*
	  Initiating pager
	  Our scene requests are paged, pages should
	  be profided for comfort purpose
	  * load handlebar template
	  * apply json context
	  * add behaviour to pager links
	 */		       
	var pager_template = sw_sc_pg;
	var pager = $(pager_template(json));
	var pg_ul = $('#sw_sc_pager');
	pg_ul.html(pager);
	var ctrls = pg_ul.find('.sw_sc_pg_ctrl');
	// adding behaviour on click
	ctrls.each(
	    function()
	    {
		// links are generated with a data-url attribute
		// this attribute is provided by the rest service
		// as scene.url
		var url = $(this).data('url');
		var handler_func = __this.redraw_scene_list.bind(__this);
		$(this).click(
		    function() {
			ajax.ajax_list_scenes(url, handler_func, f_mode);
					  
		    }
		)
	    }
	)

	/* 
	   Initiating scenes
	   For each scene we will apply its json content to a handlebars template
	*/
	for (var scene of json.results)
	{
	    var item = $(scene_item_tmpl(scene));

	    container.append(item);
	    if (first_item == undefined && scene.start != undefined) {
		first_item = item;
	    }
	    // on click on an item in the list
	    // we want to look for this specific scene
	    // and display it in the right pannel
	    item.click(
		function()
		{
		    ajax.ajax_scene_search_from_elem(
			$(this),
			__this.redraw_scene.bind(__this));
		}
	    )
	}

	// provides a callback for the manager in case of update
	this._tl_manager.update_hook = this._tl_update_hook.bind(this);

	// try to display the first item anyway
	if (first_item != undefined) {
	    first_item.click();
	}
    }

   
    
    init()
    {
	this._tl_manager.refresh_from_server();
	this.ajax.ajax_list_scenes(this.url,
				   this.redraw_scene_list.bind(this),
				   this.filter_mode
				  )
	
    }

    


}
