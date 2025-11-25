import { ObjectId } from 'mongodb'

interface OrderType {
  _id?: ObjectId
  user_id: ObjectId

  orderItems: itemProduct[] // [] | Danh sách sản phẩm trong đơn
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: number
  }
  paymentMethod_id: string // Phương thức thanh toán
  deliveryMethod_id: string // Phương thức giao hàng
  itemsPrice: number // Tổng tiền sản phẩm
  shippingPrice: number //  Phí vận chuyển
  totalPrice: number // Tổng tiền
  isPaid?: number // 0 | Đã thanh toán (0: chưa, 1: rồi)
  paidAt?: Date //  Ngày thanh toán
  isDelivered?: number // 0 | Đã giao hàng (0: chưa, 1: rồi)
  deliveryAt?: Date // Ngày giao hàng
  status?: number // 0 | Trạng thái (0: chờ thanh toán, 1: chờ giao hàng, 2: hoàn thành, 3: hủy)

  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id?: ObjectId
  user_id: ObjectId

  orderItems: itemProduct[]
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: number
  }
  paymentMethod_id: ObjectId
  deliveryMethod_id: ObjectId
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: number
  paidAt: Date
  isDelivered: number
  deliveryAt: Date
  status: number

  created_at: Date
  updated_at: Date

  constructor(order: OrderType) {
    const date = new Date()

    this._id = order._id
    this.user_id = order.user_id

    this.orderItems = order.orderItems
    this.shippingAddress = order.shippingAddress
    this.paymentMethod_id = new ObjectId(order.paymentMethod_id)
    this.deliveryMethod_id = new ObjectId(order.deliveryMethod_id)
    this.itemsPrice = order.itemsPrice
    this.shippingAddress = order.shippingAddress
    this.shippingPrice = order.shippingPrice
    this.totalPrice = order.totalPrice
    this.isPaid = order.isPaid || 0
    this.paidAt = order.paidAt || date
    this.isDelivered = order.isDelivered || 0
    this.deliveryAt = order.deliveryAt || date
    this.status = order.status || 0

    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}

export interface itemProduct {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product_id: ObjectId // sản phẩm
}
