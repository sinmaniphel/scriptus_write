(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
