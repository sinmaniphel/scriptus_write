export interface JsonObject {
  url:string
}

export interface JsonScene extends JsonObject {
  id:number
  scene_title:string
  status:number
  characters?:JsonSceneCharacters
  content:string
  description:DOMStringMap
  start:Date
  end:Date
  dt_end:string
  dt_start:string
  timeframe?:JsonTimeframe
}

export interface JsonSceneList {
  count:number
  links:JsonPage[]
  results:JsonScene[]
}

export interface JsonPage extends JsonObject {
  page:number
}

export interface JsonTimeframe extends JsonObject {
  url:string
  tf_end:string
  tf_start:string
  tf_name:string
}

export interface JsonSceneCharacters extends JsonObject {
  count:number
  list:JsonCharacter[]
}

export interface JsonCharacter {
  chara_whole_name:string
  chara_gender:JsonGender
  description?:string
}

export interface JsonGender {
  id:number,
  gender_name:string
}

export interface SceneParameters {
  page?:number
  title?:string
  timed?:string
}
