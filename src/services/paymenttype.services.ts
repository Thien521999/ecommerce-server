import { ObjectId } from 'mongodb'
import { PAYMENT_TYPE_MESSAGES } from '~/constants/messages'
import { PaymentTypeReqBody } from '~/models/requests/PaymentType.request'
import PaymentType from '~/models/schemas/PaymentType.schema'
import databaseService from './database.services'

class PaymentTypeService {
  async createPaymentType(user_id: string, body: PaymentTypeReqBody) {
    const result = await databaseService.paymenttype.insertOne(
      new PaymentType({
        user_id: new ObjectId(user_id),
        name: body.name,
        type: body.type
      })
    )

    const paymenttype = await databaseService.paymenttype.findOne({
      _id: result.insertedId
    })

    return paymenttype
  }
  async updatePaymentType(payment_type_id: string, body: PaymentTypeReqBody) {
    const paymenttype = await databaseService.paymenttype.findOneAndUpdate(
      {
        _id: new ObjectId(payment_type_id)
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

    return paymenttype.value
  }
  async getDetailPaymentType(payment_type_id: string) {
    const paymenttype = await databaseService.paymenttype.findOne({
      _id: new ObjectId(payment_type_id)
    })

    return paymenttype
  }
  async deletePaymentType(payment_type_id: string) {
    await databaseService.paymenttype.deleteOne({
      _id: new ObjectId(payment_type_id)
    })

    return {
      message: PAYMENT_TYPE_MESSAGES.DELETE_PAYMENT_TYPE_SUCCESSFULLY
    }
  }
  async getAllPaymentType(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.paymenttype.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const paymenttypes = await databaseService.paymenttype.find(query).skip(skip).limit(limit).toArray()

    return {
      message: PAYMENT_TYPE_MESSAGES.GET_ALL_PAYMENT_TYPE_SUCCESSFULLY,
      data: {
        paymenttypes,
        page,
        limit,
        total_page
      }
    }
  }
}

const paymentTypeService = new PaymentTypeService()
export default paymentTypeService
