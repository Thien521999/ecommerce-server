import { ObjectId } from 'mongodb'
import { OrderReqBody } from '~/models/requests/Order.request'
import Order, { itemProduct } from '~/models/schemas/Order.schema'
import databaseService from './database.services'

class OrdersService {
  private updateProductStock(order: itemProduct) {
    console.log(order)
    const productData = databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(order.product_id)
      },
      {
        $inc: {
          countInStock: -order.amount,
          sold: +order.amount
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return {
      message: 'Update product stock',
      data: productData
    }
  }
  async createOrder(user_id: string, body: OrderReqBody) {
    // 1. Kiểm tra stock và cập nhật tồn kho (updateProductStock)
    // 2. Tính toán giá
    // 3. Kiểm tra phương thức thanh toán
    // 4. Tạo 1 Order mới
    // 5. Gửi email xác nhận đơn hàng
    // 6. Trả về response cho FE
    // const result = await databaseService.orders.insertOne(
    //   new Order({
    //     user_id: new ObjectId(user_id),
    //     orderItems: body.orderItems,
    //     shippingAddress: body.shippingAddress,
    //     paymentMethod_id: body.paymentMethod_id,
    //     deliveryMethod_id: body.deliveryMethod_id,
    //     itemsPrice: body.itemsPrice,
    //     shippingPrice: body.shippingPrice,
    //     totalPrice: body.totalPrice
    //   })
    // )

    const promise = body.orderItems.map(this.updateProductStock)
    const result = await Promise.all(promise)
    // console.log('result---------', result)

    // const productData = await databaseService.products.findOneAndUpdate(updateProductStock)

    // const order = await databaseService.orders.findOne({
    //   _id: result.insertedId
    // })

    // return order
    return 'órder'
  }
  // async updateCity(city_id: string, body: CityReqBody) {
  //   const city = await databaseService.citys.findOneAndUpdate(
  //     {
  //       _id: new ObjectId(city_id)
  //     },
  //     {
  //       $set: {
  //         ...body
  //       }
  //     },
  //     {
  //       upsert: true,
  //       returnDocument: 'after'
  //     }
  //   )

  //   return city.value
  // }
  // async getDetailCity(city_id: string) {
  //   const city = await databaseService.citys.findOne({
  //     _id: new ObjectId(city_id)
  //   })

  //   return city
  // }
  // async deleteCity(city_id: string) {
  //   await databaseService.citys.deleteOne({
  //     _id: new ObjectId(city_id)
  //   })

  //   return {
  //     message: CITYS_MESSAGES.DELETE_CITY_SUCCESS
  //   }
  // }
  // async getAllCity(params: { page: number; limit: number; search: string }) {
  //   const { page, limit, search } = params

  //   // Query theo field, ví dụ: name
  //   const query: Record<string, any> = {}

  //   // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
  //   // $options: 'i': không phân biệt hoa/thường (case-insensitive).
  //   if (search) {
  //     query.name = { $regex: search, $options: 'i' }
  //   }

  //   const total = await databaseService.citys.countDocuments(query)
  //   const total_page = Math.ceil(total / limit)
  //   const skip = (page - 1) * limit

  //   const cities = await databaseService.citys.find(query).skip(skip).limit(limit).toArray()

  //   return {
  //     message: CITYS_MESSAGES.GET_ALL_CITY,
  //     data: {
  //       cities,
  //       page,
  //       limit,
  //       total_page
  //     }
  //   }
  // }
}

const ordersService = new OrdersService()
export default ordersService
