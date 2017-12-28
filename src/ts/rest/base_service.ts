/**
* Base definitionss for the service part of the application.
*/

import { SWDjangoUtils } from '../utils/django'
import * as rest from 'typed-rest-client/RestClient';

/** A base service definition which shoud
* be abstract
* On general basis all methods in this API
* will be called like so : method.then(...)
*/
export class BaseService {

  baseUrl:string
  _rest:rest.RestClient
  djangoUtils:SWDjangoUtils
  /**
   * Default constructor for all the services.
   * @abstract
   * @param {string} restApiRoot : the root of the Rest Api. Should be provided by the server
   */
  constructor (restApiRoot) {
    let host:string = location.host
    let protocol:string = location.protocol
    this.baseUrl = protocol+"//"+host+restApiRoot
    this._rest = new rest.RestClient('scriptus-client', this.baseUrl)
    this.djangoUtils = new SWDjangoUtils()
    //this._rest = new Proxy(rest, new RestProxyHandler())
  }

  newCsrfTokenOptions():rest.IRequestOptions {
    let _token = new SWDjangoUtils().getCsrfToken()
    var ret:rest.IRequestOptions = {
      additionalHeaders: {
        csrftoken: _token
      }
    }
    return ret;
  }

}
