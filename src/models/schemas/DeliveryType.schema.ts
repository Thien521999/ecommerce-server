import { ObjectId } from 'mongodb'

interface DeliveryTypeType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  price: number
  created_at?: Date
  updated_at?: Date
}

export default class DeliveryType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  price: number
  created_at: Date
  updated_at: Date

  constructor(item: DeliveryTypeType) {
    const date = new Date()

    this._id = item._id
    this.user_id = item.user_id
    this.name = item.name
    this.price = item.price
    this.created_at = item.created_at || date
    this.updated_at = item.updated_at || date
  }
}
