import { itemProduct } from '../schemas/Order.schema'

export interface OrderReqBody {
  orderItems: itemProduct[]
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: number
  }
  paymentMethod_id: string
  deliveryMethod_id: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
}
