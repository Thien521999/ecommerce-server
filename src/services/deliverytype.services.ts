import { ObjectId } from 'mongodb'
import { DELIVERY_TYPE_MESSAGES } from '~/constants/messages'
import { DeliveryReqBody } from '~/models/requests/Delivery.request'
import DeliveryType from '~/models/schemas/DeliveryType.schema'
import databaseService from './database.services'

class DeliveryTypeService {
  async createDeliveryType(user_id: string, body: DeliveryReqBody) {
    const result = await databaseService.deliverytype.insertOne(
      new DeliveryType({
        user_id: new ObjectId(user_id),
        name: body.name,
        price: body.price
      })
    )

    const deliverytype = await databaseService.deliverytype.findOne({
      _id: result.insertedId
    })

    return deliverytype
  }
  async updateDeliveryType(delivery_type_id: string, body: DeliveryReqBody) {
    const deliverytype = await databaseService.deliverytype.findOneAndUpdate(
      {
        _id: new ObjectId(delivery_type_id)
      },
      {
        $set: {
          ...body
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return deliverytype.value
  }
  async getDetailDeliveryType(delivery_type_id: string) {
    const deliverytype = await databaseService.deliverytype.findOne({
      _id: new ObjectId(delivery_type_id)
    })

    return deliverytype
  }
  async deleteDeliveryType(delivery_type_id: string) {
    await databaseService.deliverytype.deleteOne({
      _id: new ObjectId(delivery_type_id)
    })

    return {
      message: DELIVERY_TYPE_MESSAGES.DELETE_DELIVERY_TYPE_SUCCESSFULLY
    }
  }
  async getAllDeliveryType(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.deliverytype.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const deliverytypes = await databaseService.deliverytype.find(query).skip(skip).limit(limit).toArray()

    return {
      message: DELIVERY_TYPE_MESSAGES.GET_ALL_DELIVERY_TYPE_SUCCESSFULLY,
      data: {
        deliverytypes,
        page,
        limit,
        total_page
      }
    }
  }
}

const deliveryTypeService = new DeliveryTypeService()
export default deliveryTypeService
