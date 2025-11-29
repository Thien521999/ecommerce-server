import { productStatus } from '~/constants/enums'

export interface CreateProductReqBody {
  name: string
  slug: string
  image: string
  price: number
  countInStock: number
  discountStartDate: Date
  discountEndDate: Date
  location_id: string
  type_id: string
}

export interface UpdateProductReqBody {
  name?: string
  slug?: string
  image?: string
  price?: number
  countInStock?: number
  description?: string
  discount?: number
  discountStartDate?: Date
  discountEndDate?: Date
  sold?: number
  totalLikes?: number
  status?: productStatus
  views?: number
}
