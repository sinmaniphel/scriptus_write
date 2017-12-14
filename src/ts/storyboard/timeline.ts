import { SweetAlertManager } from '../utils/sweet';
import { SWDjangoUtils } from '../utils/django';
import * as vis from 'vis';
import * as $ from 'jquery';

export class TimeLineManager
{
 timeline:vis.Timeline
 _timeline_cont:HTMLElement
 service_url:string
 update_hook:Function
 delete_hook:Function
 select_hook:Function
 utils:SWDjangoUtils
 sweet_mgr:SweetAlertManager
 _handle_error:Function

 constructor(service_url) {
	  this.timeline = null;
  	this._timeline_cont = $('#sw_timeline')[0];
  	this.service_url = service_url;
  	this.update_hook = null;
  	this.delete_hook = null;
  	this.select_hook = null;
  	this.service_url = service_url;

  	this.utils = new SWDjangoUtils();
  	this.sweet_mgr = new SweetAlertManager();
  }



  update_alert(event, properties) {
  	var dt = properties.data[0];
  	var title = "Update scene "+dt.scene_title+" ?";
  	var text = "Do you really want to update scene ?";
  	this.sweet_mgr.prettyConfirm(
  	    title, text, event, properties, this.update_hook
  	);
  }

  redraw( data  )
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
