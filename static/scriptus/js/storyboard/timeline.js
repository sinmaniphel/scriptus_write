(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeLineManager = function () {
			function TimeLineManager(service_url) {
						_classCallCheck(this, TimeLineManager);

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

			_createClass(TimeLineManager, [{
						key: "update_alert",
						value: function update_alert(event, properties) {
									var dt = properties.data[0];
									var title = "Update scene " + dt.scene_title + " ?";
									var text = "Do you really want to update scene ?";
									this.sweet_mgr.prettyConfirm(title, text, event, properties, this.update_hook);
						}
			}, {
						key: "redraw",
						value: function redraw(data) {
									var items = new this.vis.DataSet(data);
									var _this = this;
									items.on('update', this.update_alert.bind(this));

									var options = {
												height: '300px',
												editable: true,
												onUpdate: function onUpdate(item, callback) {
															console.log(item);
												}

									};
									if (this.timeline == undefined) {
												this.timeline = new vis.Timeline(this._timeline_cont, items, options);
									} else {
												this.timeline.setData(items);
												this.timeline.redraw();
									}
									return this.timeline;
						}
			}, {
						key: "refresh_from_server",
						value: function refresh_from_server() {
									var csrftoken = this.utils.getCsrfToken();
									var err_func = this._handle_error;
									var handler_func = this.redraw.bind(this);
									$.ajax({
												url: this.service_url, // the endpoint,commonly same url
												type: "GET", // http method
												data: { csrfmiddlewaretoken: csrftoken
												},
												success: handler_func,
												error: err_func
									});
						}
			}]);

			return TimeLineManager;
}();

exports.default = TimeLineManager;

},{}]},{},[1]);
