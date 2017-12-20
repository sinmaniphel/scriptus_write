export class Character {
  wholeName:string
  description?:string
  gender:Number

  constructor(
    wholeName:string,
    gender:Number
  )
  {
    this.wholeName = wholeName
    this.gender = gender
  }

  get genderSign():string {
    switch(this.gender) {
      case 1:
        return '\u2642'
      case 2:
        return '\u2640'
      default:
      return "?"
    }
  }
}
