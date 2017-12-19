export class TimeFrame {

  start:Date
  end:Date

  constructor(
    start:string,
    end:string
  ) {
    this.start = new Date(Date.parse(start))
    this.end = new Date(Date.parse(end))
  }

  get surroundingTime () {
    if (this.start === undefined) {
      return null
    }
    var dtLowerTime = new Date(this.start.getTime())
    var iHours = dtLowerTime.getHours() - 2
    dtLowerTime.setHours(iHours)

    var bTfEnd = (this.end === undefined)
    var dtUpperTime = null
    if (bTfEnd) {
      dtUpperTime = new Date(this.end.getTime())
      iHours = dtUpperTime.getHours() + 2
      dtUpperTime.setHours(iHours)
    } else {
      dtUpperTime = new Date(this.start.getTime())
      iHours = dtUpperTime.getHours() + 3
      dtUpperTime.setHours(iHours)
    }

    var dReturn = {
      'lower': dtLowerTime,
      'upper': dtUpperTime
    }
    return dReturn
  }

  get prettyStart() {
    var locale = window.navigator.language;
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minutes: 'numeric'
     };
    return this.start.toLocaleDateString(locale,options)
  }

  get prettyEnd() {
    var locale = window.navigator.language;

    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minutes: 'numeric'
     };
    return this.end.toLocaleDateString(locale,options)
  }


}
