import { ObjectId } from 'mongodb'

interface CityType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  created_at?: Date
  updated_at?: Date
}

export default class City {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  created_at: Date
  updated_at: Date

  constructor(city: CityType) {
    const date = new Date()

    this._id = city._id
    this.user_id = city.user_id
    this.name = city.name
    this.created_at = city.created_at || date
    this.updated_at = city.updated_at || date
  }
}
