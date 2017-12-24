import { SweetAlertManager } from '../utils/sweet';
import { SceneService } from '../rest/services';

import * as vis from 'vis';
import * as $ from 'jquery';

export class TimeLineManager
{
 timeline:vis.Timeline
 _timeline_cont:HTMLElement
_service:SceneService
 update_hook:Function
 delete_hook:Function
 select_hook:Function
 sweet_mgr:SweetAlertManager
 _handle_error:Function

 constructor(service_url) {
	  this.timeline = null;
  	this._timeline_cont = $('#sw_timeline')[0];
  	this._service = new SceneService(service_url);
  	this.update_hook = null;
  	this.delete_hook = null;
  	this.select_hook = null;
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


  redraw( data:vis.DataSet<vis.DataItem>  )
    {
    var items = new vis.DataSet(data)
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
    this._service.visTimeline().then((data) => {
      this.redraw(data)
    })
  }


}
