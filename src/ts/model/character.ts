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
}
