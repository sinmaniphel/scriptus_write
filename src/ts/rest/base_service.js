"use strict";
/**
* Base definitionss for the service part of the application.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var django_1 = require("../utils/django");
var rest = require("typed-rest-client/RestClient");
/** A base service definition which shoud
* be abstract
* On general basis all methods in this API
* will be called like so : method.then(...)
*/
var BaseService = /** @class */ (function () {
    /**
     * Default constructor for all the services.
     * @abstract
     * @param {string} restApiRoot : the root of the Rest Api. Should be provided by the server
     */
    function BaseService(restApiRoot) {
        var host = location.host;
        var protocol = location.protocol;
        this.baseUrl = protocol + "//" + host + restApiRoot;
        this._rest = new rest.RestClient('scriptus-client', this.baseUrl);
        //this._rest = new Proxy(rest, new RestProxyHandler())
    }
    BaseService.prototype.newCsrfTokenOptions = function () {
        var _token = new django_1.SWDjangoUtils().getCsrfToken();
        var ret = {
            additionalHeaders: {
                csrftoken: _token
            }
        };
        return ret;
    };
    return BaseService;
}());
exports.BaseService = BaseService;
