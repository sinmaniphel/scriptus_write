import {Character} from './character'
import * as common from './common'

export class Scene {

  id:number
  title:string
  status:number=1
  characters?:Character[]
  content:string=""
  description:DOMStringMap
  timeframe?:common.TimeFrame

  constructor (
    id:number,
    title:string
  )
  {
    this.id = id
    this.title = title
  }



}
