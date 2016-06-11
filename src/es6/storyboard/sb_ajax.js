import {SWDjangoUtils} from '../utils/django';

export function myTest() {
    console.log('test');

}

export class StoryBoardAjax
{

    
    constructor()
    {
	this._sw_utils = new SWDjangoUtils();
    }

    ajax_scene_search_from_elem(elem, handler_func)
    {
	var r_url = elem.data('url') + 'detailed/';
	this.ajax_scene_search( r_url, handler_func);
		
    }

    ajax_scene_search( s_url,  handler_func )
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	$.ajax(
	    {
		url : s_url, 
		type : 'GET', 
		success: handler_func,
		error: this.handle_error
	    }
	);
    }

    ajax_list_scenes(service_url, handler_func, modes)
    {
	var csrftoken = this._sw_utils.getCsrfToken();
	var err_func = this.handle_error;
	var p_modes = Object.keys(modes) == 0 ? '' : $.param(modes);
	var append_car = service_url.includes('?') ? '&' : '?';
	var u_modes = service_url + append_car + p_modes;
	$.ajax(
	    {
		url : u_modes, 
		type : 'GET',
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
		url : scene.url, 
		type : 'PUT', 
		dataType   : 'json',
		contentType: 'application/json; charset=UTF-8',
		data : JSON.stringify(scene),
		success: handler_func,
		error: err_func
	    }
	);

    }

    _handle_error(xhr, errmsg, err) {
	console.log(xhr.status + ' : ' + xhr.responseText);
    }


}
