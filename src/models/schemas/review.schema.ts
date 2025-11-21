import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  content: string
  start: number
  created_at?: Date
  updated_at?: Date
}

export default class Review {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  content: string
  start: number
  created_at: Date
  updated_at: Date

  constructor(review: ReviewType) {
    const date = new Date()

    this._id = review._id
    this.user_id = review.user_id
    this.product_id = review.product_id
    this.content = review.content
    this.start = review.start
    this.created_at = review.created_at || date
    this.updated_at = review.updated_at || date
  }
}
