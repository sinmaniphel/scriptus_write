class StoryBoardAJax
{

    
    constructor()
    {
	this._sw_utils = new SWDjangoUtils();
	
    }

    ajax_scene_search_from_elem(elem, handler_func)
    {
	var r_url = elem.data('url');
	this.ajax_scene_search( r_url, handler_func);
		
    }

    ajax_scene_search( s_url,  handler_func )
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	$.ajax(
	    {
		url : s_url, // the endpoint,commonly same url
		type : "GET", // http method
		data : { csrfmiddlewaretoken : csrftoken, 
     		       },
		success: handler_func,
		error: this.handle_error
	    }
	);
    }

    ajax_list_scenes(service_url, handler_func, modes)
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	var err_func = this.handle_error;
	var u_modes = service_url+"?"+$.param(modes);
	$.ajax(
	    {
		url : u_modes, // the endpoint,commonly same url
		type : "GET", // http method
		data : { csrfmiddlewaretoken : csrftoken, 
     		       },
		success: handler_func,
		error: err_func
	    }
	);

    }

  
    ajax_update_scene(scene, handler_func)
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	var err_func = this._handle_error;
	$.ajax(
	    {
		url : scene.url, // the endpoint,commonly same url
		type : "PUT", // http method
		dataType   : 'json',
		contentType: 'application/json; charset=UTF-8',
		data : JSON.stringify(scene),
		success: handler_func,
		error: err_func
	    }
	);

    }

    _handle_error(xhr,errmsg,err) {
	console.log(xhr.status + ": " + xhr.responseText);
	// provide a bit more info about the error to the console
    }


}


class StoryBoardManager {


    constructor(service_url){
	// PUBLIC
	this.ajax = new StoryBoardAJax();
	// private
	this._tl_manager = new TimeLineManager(service_url+"all/?timed=timed");
	this.filter_field = null;
	this._sw_utils = new SWDjangoUtils();
	this.url = service_url;
	this._sweet_mgr = new SweetAlertManager();
	HandlebarsIntl.registerWith(Handlebars);
	this.filter_mode = {};

    }
    
    
    __get_label(time_filter) {
	switch(time_filter) {
	case "timed":
	    return "Timed scenes";
	case "untimed":
	    return "Timeless scenes";
	default:
	    return "All scenes";
	}
	
    }
    

    filter_list( element )
    {
	this.filter_field = element;
	var value = $(element).val().toLowerCase();

	$(".sw_scene_item").each(function() {
            if ($(this).find('h4').text().toLowerCase().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
	});
    }

    
    
    redraw_scene(json)
    {
	var temp_sc_panel = ScriptusTemplates.sw_sc_main_pannel
	var html = temp_sc_panel(json);
	var timeline = this.timeline
	$('#sc_main_panel').html(html);

	if(json['start']) {
	    this._tl_manager.timeline.fit(json['id']);
	    this._tl_manager.timeline.setSelection(json['id']);
	    this._tl_manager.timeline.setWindow(json['dt_start'],json['dt_end']);
	    this._tl_manager.timeline.setCurrentTime(json.start);
	   
	}
	else{
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
	var title = "Update scene "+json.scene_title+" ?";
	var text = "Do you really want to update scene ?";
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
	var scene_item_tmpl = ScriptusTemplates.sw_sc_li;
	var container = $('#scene_list');
	var __this = this;
	var ajax = this.ajax;
	
	$('.sw_scene_item').each(
	    function() {
		$(this).remove();
	    }
	);

	var first_item = undefined;

	var buttons_template = ScriptusTemplates.sw_sc_timed_dropdown
	var buttons_context = {'current_action': this.__get_label
			       (
				   this.filter_mode['timed']
			       )
			      };
	var buttons = $(buttons_template(buttons_context));
	var bt_li = $('#sw_sc_buttons');
	bt_li.html(buttons);
	var f_mode = this.filter_mode;

	var bt_filters = bt_li.find('.sc-filter-mode');
	bt_filters.each(
	    function() {
		var handler_func = __this.redraw_scene_list.bind(__this);
		$(this).click(
		    
		    function() {
			var mode = $(this).data('mode');
		
			if(mode) {
			    f_mode['timed']=mode;
			}
			else {
			    delete f_mode['timed'];
			}
		
			ajax.ajax_list_scenes(__this.url, handler_func, f_mode);
					  
		    }
		)
	    }
	);
	
		
			       
	var pager_template = ScriptusTemplates.sw_sc_pg;
	var pager = $(pager_template(json));
	var pg_ul = $('#sw_sc_pager');
	pg_ul.html(pager);
	var ctrls = pg_ul.find('.sw_sc_pg_ctrl');
	ctrls.each(
	    function()
	    {
		var url = $(this).data('url');
		var handler_func = __this.redraw_scene_list.bind(__this);
		$(this).click(
		    function() {
			ajax.ajax_list_scenes(url, handler_func, f_mode);
					  
		    }
		)
	    }
	)
	
	for(var scene of json.results)
	{
	    var item = $(scene_item_tmpl(scene));

	    container.append(item);
	    if(first_item == undefined && scene.start != undefined) {
		first_item = item;
	    }
	    item.click(
		function()
		{
		    ajax.ajax_scene_search_from_elem(
			$(this),
			__this.redraw_scene.bind(__this));
		}
	    )
	}
	this._tl_manager.update_hook = this._tl_update_hook.bind(this);
	
	if(first_item!=undefined) {
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

class TimeLineManager {

    constructor(service_url) {
	this.timeline = null;
	this._timeline_cont = $('#sw_timeline')[0];
	this.service_url = service_url;
	this.update_hook = null;
	this.delete_hook = null;
	this.select_hook = null;
	this.service_url = service_url;
	this.sweet_mgr = new SweetAlertManager();
	this.utils = new SWDjangoUtils();
    }

    update_alert(event, properties) {
	var dt = properties.data[0];
	var title = "Update scene "+dt.scene_title+" ?";
	var text = "Do you really want to update scene ?";
	this.sweet_mgr.prettyConfirm(
	    title, text, event, properties, this.update_hook
	);
    }

    redraw(
	data    )
    {
	var items = new vis.DataSet(data);
	var _this = this;
	items.on('update', this.update_alert.bind(this));

	var options = {
	    height: '300px',
	    editable: true,
	    onUpdate: function(item, callback) {
		console.log(item)
	    },
		
	};
	if(this.timeline == undefined) {
	    this.timeline = new vis.Timeline(this._timeline_cont,
					     items,
					     options);
	}
	else {
	    this.timeline.setData(items);
	    this.timeline.redraw();
	}
	return this.timeline;
    }

    refresh_from_server() {
	var csrftoken = this.utils.getCsrfToken();
	var err_func = this._handle_error;
	var handler_func = this.redraw.bind(this);
	$.ajax(
	    {
		url : this.service_url, // the endpoint,commonly same url
		type : "GET", // http method
		data : { csrfmiddlewaretoken : csrftoken, 
     		       },
		success: handler_func,
		error: err_func
	    }
	);


    }

    
   
    
}



class SWDjangoUtils {


    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
		var cookie = jQuery.trim(cookies[i]);
		// Does this cookie string begin with the name we want?
		if (cookie.substring(0, name.length + 1) == (name + '=')) {
		    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		    break;
		}
            }
	}
	return cookieValue;
    }

    getCsrfToken() {
	return this.getCookie('csrftoken');
    }

    load_handlebar_templates()
    {
	$(".sw_hb_template").each(
	    function()
	    {
		var src = $(this).attr('src');
		$(this).load(src);
	    }
	);			  
    }
    
    csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
    }

    constructor() {
	var csrftoken = this.getCsrfToken();
	var __this = this; 
	$.ajaxSetup(
	    {
	beforeSend: function(xhr, settings) {
            if (!__this.csrfSafeMethod(settings.type)
		&& __this.sameOrigin(settings.url)) {
		// Send the token to same-origin, relative URLs only.
		// Send the token only if the method warrants CSRF protection
		// Using the CSRFToken value acquired earlier
		xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
	}
	    }
	
	);
    }


}


class SweetAlertManager {

    prettyPrompt(title,
		 text,
		 inputValue,
		 event_type,
		 data,
		 callback) {
	swal(
	    {
		title: title,
		text: text,
		type: 'input',
		showCancelButton: true,
		inputValue: inputValue
	    },
	    
	    function(isConfirm) {
		if(isConfirm) {
		    callback(event_type, data);
		}
	    }
	)
    }

    prettyConfirm(title, text, event_type, data, callback) {
	swal(
	    {
		title: title,
		text: text,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: "#DD6B55"
	    },
	    function(isConfirm) {
		if(isConfirm) {
		    callback(event_type, data);
		}
	    });
    }


}



