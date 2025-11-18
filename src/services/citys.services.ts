import { ObjectId } from 'mongodb'
import { CITYS_MESSAGES } from '~/constants/messages'
import { CityReqBody } from '~/models/requests/City.request'
import City from '~/models/schemas/City.schema'
import databaseService from './database.services'

class CitiesService {
  async createCity(user_id: string, body: CityReqBody) {
    const result = await databaseService.citys.insertOne(
      new City({
        user_id: new ObjectId(user_id),
        name: body.name
      })
    )

    const city = await databaseService.citys.findOne({
      _id: result.insertedId
    })

    return city
  }
  async updateCity(city_id: string, body: CityReqBody) {
    const city = await databaseService.citys.findOneAndUpdate(
      {
        _id: new ObjectId(city_id)
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

    return city.value
  }
  async getDetailCity(city_id: string) {
    const city = await databaseService.citys.findOne({
      _id: new ObjectId(city_id)
    })

    return city
  }
  async deleteCity(city_id: string) {
    await databaseService.citys.deleteOne({
      _id: new ObjectId(city_id)
    })

    return {
      message: CITYS_MESSAGES.DELETE_CITY_SUCCESS
    }
  }
  async getAllCity(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.citys.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const cities = await databaseService.citys.find(query).skip(skip).limit(limit).toArray()

    return {
      message: CITYS_MESSAGES.GET_ALL_CITY,
      data: {
        cities,
        page,
        limit,
        total_page
      }
    }
  }
}

const citiesService = new CitiesService()
export default citiesService
