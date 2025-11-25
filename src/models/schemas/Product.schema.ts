import { ObjectId } from 'mongodb'
import { productStatus } from '~/constants/enums'

interface ProductType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  slug?: string
  image: string
  price: number
  countInStock: number
  description?: string
  discount?: number
  discountStartDate: Date
  discountEndDate: Date
  rating?: number
  sold?: number
  type_id?: ObjectId // Loại sản phẩm
  location_id?: ObjectId
  likedBy?: ObjectId[] // Danh sách user đã like
  totalLikes?: number // 0 | Tổng số lượt like
  status?: productStatus // 0 | Trạng thái (0: inactive, 1: active)
  views?: number // 0 | Tổng số lượt xem
  uniqueViews?: ObjectId[] // Danh sách user đã xem

  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  slug: string
  image: string
  price: number
  countInStock: number
  description: string
  discount: number
  discountStartDate: Date
  discountEndDate: Date
  rating: number
  sold: number
  type_id: ObjectId // Loại sản phẩm ProductType
  location_id: ObjectId // Cities
  likedBy?: ObjectId[] // Danh sách user đã like
  totalLikes?: number // 0 | Tổng số lượt like
  status: productStatus // 0 | Trạng thái (0: inactive, 1: active)
  views?: number // 0 | Tổng số lượt xem
  uniqueViews?: ObjectId[] // Danh sách user đã xem // user

  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const date = new Date()

    this._id = product._id
    this.user_id = product.user_id
    this.name = product.name
    this.slug = product.slug || ''
    this.image = product.image
    this.price = product.price
    this.countInStock = product.countInStock
    this.description = product.description || ''
    this.discount = product.discount || 0
    this.discountStartDate = product.discountStartDate
    this.discountEndDate = product.discountEndDate
    this.rating = product.rating || 0
    this.sold = product.sold || 0
    this.type_id = product.type_id || new ObjectId()
    this.location_id = product.location_id || new ObjectId()
    this.likedBy = product.likedBy || []
    this.totalLikes = product.totalLikes || 0
    this.status = product.status || 0
    this.views = product.views || 0
    this.uniqueViews = product.uniqueViews || []

    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
