/**
* Base definitionss for the service part of the application.
* @module rest/base_service
*/

import { SWDjangoUtils } from '../utils/django'
import * as rest from 'restler'

/** A base service definition which shoud
* be abstract
* On general basis all methods in this API
* will be called like so : method.then(...)
*/
export class BaseService {

  /**
   * Default constructor for all the services.
   * @abstract
   * @param {string} restApiRoot : the root of the Rest Api. Should be provided by the server
   */
  constructor (restApiRoot) {
    this.baseUrl = restApiRoot
    this._rest = new Proxy(rest, new RestProxyHandler())
  }

}

/**
* This class will be used to intercept
* rest calls and wrapp them adding the CSRF token
*
* Besides we will return a Promise instead of an Event
*/
class RestProxyHandler {

  constructor () {
    this.__csrfMethods = [ 'post', 'put', 'delete' ]
    this.readMethods = ['get']
    this._swUtils = new SWDjangoUtils()
  }

  /* What we want to do here, is to intercept
   * a call needing a csrf token.
   * we will add it to the options,
   * which is the second parameter of
   * the function call
   */
  get (target, propKey, receiver) {
    // target is the proxied object
    // propKey is the object property name being called

    // for the sake of naming, the actual property
    // will be called method, but can be an object
    const origMethod = target[propKey]

    // therefore, we check whether it's in the
    // array of methods we want to intercept
    var iCsrfIndex = this.__csrfMethods.indexOf('propKey')

    // particular case : get, that we want to
    // wrap in a promise
    if (propKey === 'get') {
      return this._wrapInPromise(origMethod)
    }
    if (iCsrfIndex === -1) {
      // if not, we will return the actual property
      return origMethod
    }

    // Now here is where the magic happens
    // first we get the Csrf token
    var csrfToken = this._swUtils.getCsrfToken()

    // and we return a function adding this token
    return function (...args) {
      // ...args is an arbitrary array of arguments
      args[1].options.csrftoken = csrfToken
      return this._wrapInPromise(origMethod, args)
    }
  }
  // wraps the Request events in a promise
  _wrapInPromise (restMethod, args) {
    var prCallback = function (resolve, reject) {
      restMethod.apply(this, args).on(
	'complete',
	function (result) {
  if (result instanceof Error) {
    reject(result)
  } else {
    resolve(result)
  }
	}
      )
    }
    return new Promise(prCallback)
  }
}
