import { ObjectId } from 'mongodb'

interface PaymentTypeType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  type: string
  created_at?: Date
  updated_at?: Date
}

export default class PaymentType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  type: string
  created_at: Date
  updated_at: Date

  constructor(item: PaymentTypeType) {
    const date = new Date()

    this._id = item._id
    this.user_id = item.user_id
    this.name = item.name
    this.type = item.type
    this.created_at = item.created_at || date
    this.updated_at = item.updated_at || date
  }
}
