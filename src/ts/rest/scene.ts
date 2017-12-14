export class Scene {

  url:string
  title:string
  description:DOMStringMap
  status:string
  timeframe:any
  raw:any

  constructor (
    url,
    id,
    title,
    description,
    status,
    timeframe,
    rawJson) {
    this.url = url
    this.title = title
    this.description = description
    this.status = status
    this.timeframe = timeframe
    this.raw = rawJson
  }

  get start () {
    return this.timeframe.dt_start
  }

  set start (start) {
    this.timeframe.tf_start = start
  }

  get end () {
    return this.timeframe.dt_end
  }

  set end (end) {
    this.timeframe.dt_end = end
  }

  get content () {
    return this.title
  }

  get surroundingTime () {
    if (this.timeframe.tf_start === undefined) {
      return null
    }
    var dtLowerTime = new Date(this.timeframe.tf_start)
    var iHours = dtLowerTime.getHours() - 2
    dtLowerTime.setHours(iHours)

    var bTfEnd = (this.timeframe.tf_end === undefined)
    var dtUpperTime = null
    if (bTfEnd) {
      dtUpperTime = new Date(this.timeframe.tf_end)
      iHours = dtUpperTime.getHours() + 2
      dtUpperTime.setHours(iHours)
    } else {
      dtUpperTime = new Date(this.timeframe.tf_start)
      iHours = dtUpperTime.getHours() + 3
      dtUpperTime.setHours(iHours)
    }

    var dReturn = {
      'lower': dtLowerTime,
      'upper': dtUpperTime
    }
    return dReturn
  }
}

export interface SceneParameters {

  title?:string
  timed?:string
}

export function getSceneSurroundingTime (scene:Scene) {
  if (scene.timeframe.tf_start === undefined) {
    return null
  }
  var dtLowerTime = new Date(scene.timeframe.tf_start)
  var iHours = dtLowerTime.getHours() - 2
  dtLowerTime.setHours(iHours)

  var bTfEnd = (scene.timeframe.tf_end === undefined)
  var dtUpperTime = null
  if (bTfEnd) {
    dtUpperTime = new Date(scene.timeframe.tf_end)
    iHours = dtUpperTime.getHours() + 2
    dtUpperTime.setHours(iHours)
  } else {
    dtUpperTime = new Date(scene.timeframe.tf_start)
    iHours = dtUpperTime.getHours() + 3
    dtUpperTime.setHours(iHours)
  }

  var dReturn = {
    'lower': dtLowerTime,
    'upper': dtUpperTime
  }
  return dReturn
}

// function deserializeMultiple (json) {
//   var ret = {}
//   for (var val of json) {
//     if (val !== 'results') {
//       ret[val] = json[val]
//     }
//   }
//   ret.scenes = []
//   for (var rawScene of json.results) {
//     ret.scenes.push(deserialize(rawScene))
//   }
//   return ret
// }
//
// export function deserialize (json, multiple = false) {
//   if (multiple) {
//     deserializeMultiple(json)
//   }
//
//   return new Scene(
// 	json.url,
// 	json.scene_title,
// 	json.description,
// 	json.scene_status,
// 	json.timeframe,
// 	json
//     )
// }
//
// export function serialize (scene) {
//   return scene.raw
// }
