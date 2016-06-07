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

    ajax_list_scenes(service_url, handler_func)
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	var err_func = this.handle_error;
	$.ajax(
	    {
		url : service_url, // the endpoint,commonly same url
		type : "GET", // http method
		data : { csrfmiddlewaretoken : csrftoken, 
     		       },
		success: handler_func,
		error: err_func
	    }
	);

    }

    ajax_update_scene(scene, service_url, handler_func)
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	var err_func = this.handle_error;
	var n_scene = {'id': scene.id,
		       'title': scene.title}
	$.ajax(
	    {
		url : service_url, // the endpoint,commonly same url
		type : "POST", // http method
		data : { csrfmiddlewaretoken : csrftoken,
			 up_scene: n_scene},
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
	this.timeline = null;
	this.ajax = new StoryBoardAJax();
	// private
	this._timeline_cont = $('#sw_timeline')[0];
	this.filter_field = null;
	this._sw_utils = new SWDjangoUtils();
	this.urls = service_url;

    }
    
    
    
    init_timeline(
	data    )
    {
	var items = new vis.DataSet(data);

	var options = {
	    height: '300px'
	};
	this.timeline = new vis.Timeline(this._timeline_cont,data,options);
	return this.timeline 
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
	    timeline.fit(json['id']);
	    timeline.setSelection(json['id']);
	    timeline.setWindow(json['dt_start'],json['dt_end']);
	    timeline.setCurrentTime(json.start);
	   
	}
	else{
	    // picker.data("DateTimePicker").date(d_time);
	    this.__setup_dt_picker(json);
	}

    }

    __setup_dt_picker(json) {
	var d_time = this.timeline.getCurrentTime();
	var __this = this;
	var picker = $('#sc_datetimepicker').datetimepicker({
	    sideBySide: true,
	    defaultDate: d_time
	});
	picker.on('dp.change', function(e) {
	    // e.date is a moment object
	    json['start'] = e.date.toJSON();
	    __this.ajax.ajax_update_scene(json,
					  __this.urls.update,
					  __this.init)
	}
		 )

    }

    redraw_scene_list(json)
    {
	var scene_item_tmpl = ScriptusTemplates.sw_sc_li;
	var container = $('#scene_list');
	var __this = this;
	var ajax = this.ajax
	
	$('.sw_scene_item').each(
	    function() {
		$(this).remove();
	    }
	);

	var first_item = undefined;
	
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
	this.init_timeline(json.results.filter(
	    function(el){
		return el.start != undefined;
	    }
	));
	first_item.click();
    }

    
    init()
    {
	this.ajax.ajax_list_scenes(this.urls.list,
				   this.redraw_scene_list.bind(this)
				  )
	    
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


}





