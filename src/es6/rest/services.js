import { BaseService } from './base_service'
import { serialize, deserialize } from './scene'

export class SceneService extends BaseService {

  constructor (restApiRoot) {
    super(restApiRoot)
    this.serviceRoot = this.baseUrl + 'scene'
  }

  list () {
    return this._rest.get(this.baseUrl).then(
      function (result) {
        return deserialize(result, true)
      }
    )
  }

  detail (scene) {
    var sUrl = this.baseUrl + `/{scene.id}/detailed`
    return this._rest.get(sUrl).then(
      function (result) {
        return deserialize(result)
      }
    )
  }
}
