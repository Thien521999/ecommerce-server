import { ObjectId } from 'mongodb'

interface ProductTypeType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  slug: string
  created_at?: Date
  updated_at?: Date
}

export default class ProductType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  slug: string
  created_at: Date
  updated_at: Date

  constructor(item: ProductTypeType) {
    const date = new Date()

    this._id = item._id
    this.user_id = item.user_id
    this.name = item.name
    this.slug = item.slug
    this.created_at = item.created_at || date
    this.updated_at = item.updated_at || date
  }
}
