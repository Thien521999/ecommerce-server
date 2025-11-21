import { ObjectId } from 'mongodb'
import { ProductTypeReqBody } from '~/models/requests/ProductType.request'
import ProductType from '~/models/schemas/ProductType.schema'
import databaseService from './database.services'
import { PRODUCTTYPES_MESSAGES } from '~/constants/messages'

class ProductTypesService {
  async createProductType(user_id: string, body: ProductTypeReqBody) {
    const result = await databaseService.producttypes.insertOne(
      new ProductType({
        user_id: new ObjectId(user_id),
        name: body.name,
        slug: body.slug
      })
    )

    const producttype = await databaseService.producttypes.findOne({
      _id: result.insertedId
    })

    return producttype
  }
  async updateProducttype(producttype_id: string, body: ProductTypeReqBody) {
    const producttype = await databaseService.producttypes.findOneAndUpdate(
      {
        _id: new ObjectId(producttype_id)
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

    return producttype.value
  }
  async getDetailProducttype(producttype_id: string) {
    const producttype = await databaseService.producttypes.findOne({
      _id: new ObjectId(producttype_id)
    })

    return producttype
  }
  async deleteProducttype(producttype_id: string) {
    await databaseService.producttypes.deleteOne({
      _id: new ObjectId(producttype_id)
    })

    return {
      message: PRODUCTTYPES_MESSAGES.DELETE_PRODUCTTYPE_SUCCESSFULLY
    }
  }
  async getAllProducttypes(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.producttypes.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const producttypes = await databaseService.citys.find(query).skip(skip).limit(limit).toArray()

    return {
      message: PRODUCTTYPES_MESSAGES.GET_ALL_PRODUCTTYPES,
      data: {
        producttypes,
        page,
        limit,
        total_page
      }
    }
  }
}

const productTypesService = new ProductTypesService()
export default productTypesService
