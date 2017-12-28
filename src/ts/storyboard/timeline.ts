import { SweetAlertManager } from '../utils/sweet';
import { SceneService } from '../rest/services';

import * as vis from 'vis';
import * as $ from 'jquery';

export class TimeLineManager
{
 timeline:vis.Timeline
 currentDataSet:vis.DataSet

 sweet_mgr:SweetAlertManager
_service:SceneService

_timeline_cont:HTMLElement

 update_hook:Function
 delete_hook:Function
 select_hook:Function
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

  cancel(properties) {
    console.log(properties)
    //this.currentDataSet.udpate(properties.oldData[0])
  }

  remoteUpdate(item) {
    this._service.updateTime(item.id, item.start, item.end).then(
      (errorCode) => {
        console.log("return from service")
        console.log(errorCode)
      }
    )
  }

  update_alert(item, callback) {
    var dt = item;
  	var title = "Update scene "+dt.content+" ?";
  	var text = "Do you really want to update scene ?";
    var cancel:Function = (data) => {
      callback(null)
    }
    var update:Function = (data) => {
      callback(data)
      this.remoteUpdate(data)
      //this.update_hook(data)
    }
  	this.sweet_mgr.prettyConfirm(
  	    title, text, item, update, cancel
  	);

    // update the DataSet vis previous item if pretty confirm false
  }


  redraw( data:vis.DataSet<vis.DataItem>  )
    {
    var items = new vis.DataSet(data)
    this.currentDataSet = items
  	var _this = this;
  	// items.on('update', (event, properties) => {
    //    this.update_alert(event, properties)
    // });

  	var options = {
  	    height: '600px',
  	    editable: true,
        onMove: (item, callback) => {
          this.update_alert(item, callback)
        }
	     };
  	if(this.timeline == undefined) {
  	    this.timeline = new vis.Timeline(this._timeline_cont,
  					     items,
  					     options);
  	}
  	else {
  	    this.timeline.setData(items);
        this.timeline.setOptions(options)
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
