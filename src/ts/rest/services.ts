import { BaseService } from './base_service'
import { Scene } from './scene'
import { SceneParameters} from './scene'
import * as rest from 'typed-rest-client/RestClient';
import * as qs from 'query-string'

export class SceneService extends BaseService {

  serviceRoot:string

  constructor (restApiRoot) {
    super(restApiRoot)
    this.serviceRoot = this.baseUrl + 'scene'
  }

  list (parameters?:SceneParameters):Promise<rest.IRestResponse<Scene[]>> {
    //rm.IRestResponse<Scene>
    let url = this.baseUrl
    if(parameters) {
      url+="?"+qs.stringify(parameters)
    }
    return this._rest.get<Scene[]>(url);
  }

  detail (id:Number):Promise<rest.IRestResponse<Scene>> {
    var sUrl = this.baseUrl+id+"/detailed"
    return this._rest.get<Scene>(sUrl);
  }
}
