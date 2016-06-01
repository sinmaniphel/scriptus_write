class StoryBoardManager {

    // PUBLIC
    var timeline = null;

    // private
    var _timeline_cont = null;
    var filter_field = null;

    function init_timeline(
	cont_name,
	data    )
    {
	this._timeline_cont = $(cont_name)[0];
	var items = new vis.DataSet(data);

	var options = {
	    height: '300px'
	};
	this.timeline = new vis.Timeline(tl,data,options);
	return this.timeline 
    }

    function init_search_filter( element )
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

    function _handle_error(xhr,errmsg,err) {
	console.log(xhr.status + ": " + xhr.responseText);
	// provide a bit more info about the error to the console
    }

    function ajax_scene_search(elem, handler_func)
    {
	var csrftoken = new SWDjangoUtils().getCsrfToken();
	var r_url = elem.data('url');
	var scid = elem.data('scid');
	$.ajax(
	    {
		url : r_url, // the endpoint,commonly same url
		type : "POST", // http method
		data : { csrfmiddlewaretoken : csrftoken, 
			 scene_id : scid,
     		       },
		success: handler_func,
		error: handle_error
	    }
	);	
    }

    function redraw_scene(json)
    {
	$('#scene_title').text(json['title']);
	$('#scene_content').html(json['content']);
	var date_content = $('#sc_date_content');
	var t_untimed = "<div class='input-group date' id='sc_datetimepicker'>"+
            "<input type='text' class='form-control' />"+
            "<span class='input-group-addon'>"+
            "<span class='glyphicon glyphicon-calendar'></span>"+
            "</span>"+
            "</div>";
 	
	if(json['start']) {
	    tl.fit(json['scene_id']);
	    tl.setSelection(json['scene_id']);
	    tl.setWindow(json['start'],json['end']);
	    var t_timed = "<span class='label label-success' id='sc_dt_start'>+"+
		json['dt_start']+"</span>"+
		"<span class='label label-danger' id='sc_dt_end'>"
		+json['dt_end']+
		"</span>";
	    $('#sc_date_content').html(t_timed);
	}
	else{
	    var d_time = tl.getSelection()[0].start;
	    $('#sc_date_content').html(t_untimed);
	    var picker = $('#sc_datetimepicker').datetimepicker({
		sideBySide: true
	    });
	    picker.data("DateTimePicker").date(d_time);
	}
    }

    function draw_list_scene_item(list_id, timeline_id, json) {
	var scenes = json['scenes'];
	$('#'+list_id+'> .sw_scene_item').each(
	    function() {
		$(this).remove();
	    }
	);	
    }

    function init()
    {
	$(".sw_scene_item")
	    .each(function()
		  {
		      $(this).click(
			  function()
			  {
			      ajax_scene_search(
				  $(this),
				  update_sc);
			  }
		      );
		  }
		 );
    }


}


class SWDjangoUtils {


    function getCookie(name) {
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

    function getCsrfToken() {
	return getCookie('csrftoken');
    }

}





