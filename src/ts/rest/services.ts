import { BaseService } from './base_service'
import * as json from './json_model'
import * as bld from './builder'

import { Scene } from '../model/scene'
import { Character } from '../model/character'

import * as rest from 'typed-rest-client/RestClient';
import * as qs from 'query-string'

import * as vis from 'vis'

export interface RemoteSceneListResult {
  pages:json.SceneParameters[]
  previous?:json.SceneParameters
  next?:json.SceneParameters
  scenes:Scene[]
}

export class SceneService extends BaseService {

  serviceRoot:string
  listParams?:json.SceneParameters

  constructor (restApiRoot) {
    super(restApiRoot)
    this.serviceRoot = this.baseUrl + 'scene'
  }

  async list (parameters?:json.SceneParameters):Promise<RemoteSceneListResult> {
    //rm.IRestResponse<Scene>
    let url = this.baseUrl
    if(parameters) {
      url+="?"+qs.stringify(parameters)
    }
    let currentPage:number = parameters?parameters.page:1

    let jScenesResp:rest.IRestResponse<json.JsonSceneList> = await this._rest.get<json.JsonSceneList>(url)


    let links = jScenesResp.result.links
    let pages:json.SceneParameters[] = []
    for(let link of links ) {
      let param:json.SceneParameters = {
        page:link.page,
      }
      if(parameters) {
        param.timed = parameters.timed
        param.title = parameters.title
      }
      pages.push(param)
    }

    let scenes:Scene[] = []
    for(let jsC of jScenesResp.result.results) {
      scenes.push(bld.buildScene(jsC))
    }

    let result:RemoteSceneListResult =
    {
        pages:pages,
        scenes:scenes
    }
    if(1 != currentPage)
    {
        result.previous = {
            page:currentPage-1
        }
        if(parameters) {
          result.previous.timed = parameters.timed
          result.previous.title = parameters.title
        }

    }
    if(links.length != currentPage)
    {
        result.next = {
            page:currentPage+1
        }
        if(parameters) {
          result.next.timed = parameters.timed
          result.next.title = parameters.title
        }

    }

    let prom:Promise<RemoteSceneListResult> = new Promise<RemoteSceneListResult>((resolve, reject) => {
      resolve(result)
    })
    // keeping the current page in memory
    return prom
  }

  async visTimeline():Promise<vis.DataSet<vis.DataItem>> {
    console.log(this.baseUrl)
    let sUrl:string = this.baseUrl+'vis_tl'
    let remoteResult:rest.IRestResponse<vis.DataSet<vis.DataItem>> = await this._rest.get<vis.DataSet<vis.DataItem>>(sUrl)
    return new Promise<vis.DataSet<vis.DataItem>>(
      (resolve, reject) => {
        resolve(remoteResult.result)
      }
    );
  }

  async detail (id:Number):Promise<Scene> {
    var sUrl = this.baseUrl+id+"/detailed"
    let remoteResult:rest.IRestResponse<json.JsonScene> = await this._rest.get<json.JsonScene>(sUrl)
    return new Promise<Scene>(
      (resolve, reject) => {
        resolve(bld.buildScene(remoteResult.result))
      }
    );
  }
}

export class CharacterService extends BaseService {
  constructor (restApiRoot) {
    super(restApiRoot)
  }

  async list():Promise<Character[]> {
    let jCharResp:rest.IRestResponse<json.JsonCharacter[]> = await this._rest.get<json.JsonCharacter[]>(this.baseUrl)
    let chars:Character[] = []
    for(let jChar of jCharResp.result) {
      chars.push(bld.buildCharacter(jChar))
    }

    return new Promise<Character[]> (
      (resolve, reject) => {
        resolve(chars)
      }
    )
  }

}
