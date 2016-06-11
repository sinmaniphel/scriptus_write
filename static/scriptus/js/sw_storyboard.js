(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //import * as $ from 'static/vendor/jquery/dist/jquery.js';

var _sweet = require('../utils/sweet');

var _django = require('../utils/django');

var _sb_ajax = require('./sb_ajax.js');

var _timeline = require('./timeline');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoryBoardManager = function () {
	function StoryBoardManager(service_url) {
		_classCallCheck(this, StoryBoardManager);

		// PUBLIC
		this.ajax = new StoryBoardAJax();
		// private
		this._tl_manager = new _timeline.TimeLineManager(service_url + 'all/?timed=timed');
		this.filter_field = null;
		this._sw_utils = new _django.SWDjangoUtils();
		this.url = service_url;
		this._sweet_mgr = new _sweet.SweetAlertManager();
		//	HandlebarsIntl.registerWith(Handlebars);
		this.filter_mode = {};
	}

	_createClass(StoryBoardManager, [{
		key: '__get_label',
		value: function __get_label(time_filter) {
			switch (time_filter) {
				case 'timed':
					return 'Timed scenes';
				case 'untimed':
					return 'Timeless scenes';
				default:
					return 'All scenes';
			}
		}
	}, {
		key: 'filter_list',
		value: function filter_list(element) {
			this.filter_field = element;
			var value = $(element).val().toLowerCase();
			var threshold = 4;
			if (value.length < threshold) {
				delete this.filter_mode['scene_title'];
				return;
			}

			this.filter_mode['scene_title'] = value;
			this.ajax.ajax_list_scenes(this.url, this.redraw_scene_list.bind(this), this.filter_mode);
		}
	}, {
		key: 'redraw_scene',
		value: function redraw_scene(json) {

			// load the panel handlebar template
			var temp_sc_panel = ScriptusTemplates.sw_sc_main_pannel;
			var html = temp_sc_panel(json);
			var timeline = this.timeline;

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
			if (json['start']) {
				this._tl_manager.timeline.fit(json['id']);
				this._tl_manager.timeline.setSelection(json['id']);
				this._tl_manager.timeline.setWindow(json['dt_start'], json['dt_end']);
				this._tl_manager.timeline.setCurrentTime(json.start);
			} else {
				// picker.data("DateTimePicker").date(d_time);
				this.__setup_dt_picker(json);
			}
		}
	}, {
		key: '__setup_dt_picker',
		value: function __setup_dt_picker(json) {
			var d_time = this._tl_manager.timeline.getCurrentTime();
			var __this = this;
			var picker = $('#sc_datetimepicker').datetimepicker({
				sideBySide: true,
				defaultDate: d_time,
				locale: navigator.language
			});
			picker.on('dp.change', function (e) {
				// e.date is a moment object

				__this.__scene_update_alert(e, json);
			});
		}
	}, {
		key: '__scene_update_alert',
		value: function __scene_update_alert(event, json) {
			var title = 'Update scene ' + json.scene_title + ' ?';
			var text = 'Do you really want to update scene ?';
			json.timeframe.tf_start = event.date.toJSON();
			this._sweet_mgr.prettyConfirm(title, text, 'update', json, this._sc_update_hook.bind(this));
		}
	}, {
		key: '_sc_update_hook',
		value: function _sc_update_hook(event, properties) {
			var dt = properties;
			this.ajax.ajax_update_scene(dt, this.init.bind(this));
		}
	}, {
		key: '_tl_update_hook',
		value: function _tl_update_hook(event, properties) {
			var dt = properties.data[0];
			dt.timeframe.tf_start = dt.start;
			dt.timeframe.tf_end = dt.end;
			this.ajax.ajax_update_scene(dt, this.init.bind(this));
		}
	}, {
		key: 'redraw_scene_list',
		value: function redraw_scene_list(json) {

			var scene_item_tmpl = ScriptusTemplates.sw_sc_li;

			// fetching the container for the list
			var container = $('#scene_list');

			// will be used in nested functions
			var __this = this;

			// shortcut and reference
			var ajax = this.ajax;

			// clear previous list
			$('.sw_scene_item').each(function () {
				$(this).remove();
			});

			var first_item = undefined;

			/*
     Init buttons
     What we want to do here is :
     * Load the compiled handlebars template
     * Get the current mode
     * Add events to the buttons
    */
			var buttons_template = ScriptusTemplates.sw_sc_timed_dropdown;
			var buttons_context = { 'current_action': this.__get_label(this.filter_mode['timed'])
			};
			var buttons = $(buttons_template(buttons_context));
			var bt_li = $('#sw_sc_buttons');
			bt_li.html(buttons);
			var f_mode = this.filter_mode;

			// adding behaviour
			var bt_filters = bt_li.find('.sc-filter-mode');
			bt_filters.each(function () {
				// ask to redraw list on filter
				// binding to this guarantees that the context
				// will be the story board manager
				var handler_func = __this.redraw_scene_list.bind(__this);
				$(this).click(function () {
					// each button contains a data-mode attribute
					var mode = $(this).data('mode');

					if (mode) {
						f_mode['timed'] = mode;
					} else {
						// except for one, which is default status
						delete f_mode['timed'];
					}
					// actual call to the ajax service
					ajax.ajax_list_scenes(__this.url, handler_func, f_mode);
				});
			});

			/*
     Initiating pager
     Our scene requests are paged, pages should
     be profided for comfort purpose
     * load handlebar template
     * apply json context
     * add behaviour to pager links
    */
			var pager_template = ScriptusTemplates.sw_sc_pg;
			var pager = $(pager_template(json));
			var pg_ul = $('#sw_sc_pager');
			pg_ul.html(pager);
			var ctrls = pg_ul.find('.sw_sc_pg_ctrl');
			// adding behaviour on click
			ctrls.each(function () {
				// links are generated with a data-url attribute
				// this attribute is provided by the rest service
				// as scene.url
				var url = $(this).data('url');
				var handler_func = __this.redraw_scene_list.bind(__this);
				$(this).click(function () {
					ajax.ajax_list_scenes(url, handler_func, f_mode);
				});
			});

			/* 
      Initiating scenes
      For each scene we will apply its json content to a handlebars template
   */
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = json.results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var scene = _step.value;

					var item = $(scene_item_tmpl(scene));

					container.append(item);
					if (first_item == undefined && scene.start != undefined) {
						first_item = item;
					}
					// on click on an item in the list
					// we want to look for this specific scene
					// and display it in the right pannel
					item.click(function () {
						ajax.ajax_scene_search_from_elem($(this), __this.redraw_scene.bind(__this));
					});
				}

				// provides a callback for the manager in case of update
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this._tl_manager.update_hook = this._tl_update_hook.bind(this);

			// try to display the first item anyway
			if (first_item != undefined) {
				first_item.click();
			}
		}
	}, {
		key: 'init',
		value: function init() {
			this._tl_manager.refresh_from_server();
			this.ajax.ajax_list_scenes(this.url, this.redraw_scene_list.bind(this), this.filter_mode);
		}
	}]);

	return StoryBoardManager;
}();

exports.default = StoryBoardManager;

},{"../utils/django":5,"../utils/sweet":6,"./sb_ajax.js":2,"./timeline":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoryBoardAJax = function () {
			function StoryBoardAJax() {
						_classCallCheck(this, StoryBoardAJax);

						this._sw_utils = new SWDjangoUtils();
			}

			_createClass(StoryBoardAJax, [{
						key: 'ajax_scene_search_from_elem',
						value: function ajax_scene_search_from_elem(elem, handler_func) {
									var r_url = elem.data('url') + 'detailed/';
									this.ajax_scene_search(r_url, handler_func);
						}
			}, {
						key: 'ajax_scene_search',
						value: function ajax_scene_search(s_url, handler_func) {
									var csrftoken = this._sw_utils.getCsrfToken();
									$.ajax({
												url: s_url,
												type: 'GET',
												success: handler_func,
												error: this.handle_error
									});
						}
			}, {
						key: 'ajax_list_scenes',
						value: function ajax_list_scenes(service_url, handler_func, modes) {
									var csrftoken = this._sw_utils.getCsrfToken();
									var err_func = this.handle_error;
									var p_modes = Object.keys(modes) == 0 ? '' : $.param(modes);
									var append_car = service_url.includes('?') ? '&' : '?';
									var u_modes = service_url + append_car + p_modes;
									$.ajax({
												url: u_modes,
												type: 'GET',
												success: handler_func,
												error: err_func
									});
						}
			}, {
						key: 'ajax_update_scene',
						value: function ajax_update_scene(scene, handler_func) {
									var csrftoken = this._sw_utils.getCsrfToken();
									var err_func = this._handle_error;
									$.ajax({
												url: scene.url,
												type: 'PUT',
												dataType: 'json',
												contentType: 'application/json; charset=UTF-8',
												data: JSON.stringify(scene),
												success: handler_func,
												error: err_func
									});
						}
			}, {
						key: '_handle_error',
						value: function _handle_error(xhr, errmsg, err) {
									console.log(xhr.status + ' : ' + xhr.responseText);
						}
			}]);

			return StoryBoardAJax;
}();

exports.default = StoryBoardAJax;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _manager = require('./storyboard/manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list_url = $('#scene-service-url').data('url');
var sb_manager = new _manager2.default(list_url);
sb_manager.init();

},{"./storyboard/manager":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SWDjangoUtils = function () {
			_createClass(SWDjangoUtils, [{
						key: 'getCookie',
						value: function getCookie(name) {
									var cookieValue = null;
									if (document.cookie && document.cookie != '') {
												var cookies = document.cookie.split(';');
												for (var i = 0; i < cookies.length; i++) {
															var cookie = jQuery.trim(cookies[i]);
															// Does this cookie string begin with the name we want?
															if (cookie.substring(0, name.length + 1) == name + '=') {
																		cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
																		break;
															}
												}
									}
									return cookieValue;
						}
			}, {
						key: 'getCsrfToken',
						value: function getCsrfToken() {
									return this.getCookie('csrftoken');
						}
			}, {
						key: 'csrfSafeMethod',
						value: function csrfSafeMethod(method) {
									// these HTTP methods do not require CSRF protection
									return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
									);
						}
			}, {
						key: 'sameOrigin',
						value: function sameOrigin(url) {
									// test that a given url is a same-origin URL
									// url could be relative or scheme relative or absolute
									var host = document.location.host; // host + port
									var protocol = document.location.protocol;
									var sr_origin = '//' + host;
									var origin = protocol + sr_origin;
									// Allow absolute or scheme relative URLs to same origin
									return url == origin || url.slice(0, origin.length + 1) == origin + '/' || url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/' ||
									// or any other URL that isn't scheme relative or absolute i.e relative.
									!/^(\/\/|http:|https:).*/.test(url);
						}
			}]);

			function SWDjangoUtils() {
						_classCallCheck(this, SWDjangoUtils);

						var csrftoken = this.getCsrfToken();
						var __this = this;
						$.ajaxSetup({
									beforeSend: function beforeSend(xhr, settings) {
												if (!__this.csrfSafeMethod(settings.type) && __this.sameOrigin(settings.url)) {
															// Send the token to same-origin, relative URLs only.
															// Send the token only if the method warrants CSRF protection
															// Using the CSRFToken value acquired earlier
															xhr.setRequestHeader('X-CSRFToken', csrftoken);
												}
									}
						});
			}

			return SWDjangoUtils;
}();

exports.default = SWDjangoUtils;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SweetAlertManager = function () {
	function SweetAlertManager() {
		_classCallCheck(this, SweetAlertManager);
	}

	_createClass(SweetAlertManager, [{
		key: 'prettyPrompt',
		value: function prettyPrompt(title, text, inputValue, event_type, data, callback) {
			swal({
				title: title,
				text: text,
				type: 'input',
				showCancelButton: true,
				inputValue: inputValue
			}, function (isConfirm) {
				if (isConfirm) {
					callback(event_type, data);
				}
			});
		}
	}, {
		key: 'prettyConfirm',
		value: function prettyConfirm(title, text, event_type, data, callback) {
			swal({
				title: title,
				text: text,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55'
			}, function (isConfirm) {
				if (isConfirm) {
					callback(event_type, data);
				}
			});
		}
	}]);

	return SweetAlertManager;
}();

exports.default = SweetAlertManager;

},{}]},{},[4]);
