(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
