import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CITYS_MESSAGES, ORDERS_MESSAGES } from '~/constants/messages'
import { CityReqBody } from '~/models/requests/City.request'
import { OrderReqBody } from '~/models/requests/Order.request'
import { TokenPayload } from '~/models/requests/User.requests'
import citysService from '~/services/citys.services'
import ordersService from '~/services/orders.services'

export const createOrderController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  console.log({ body: req.body })
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await ordersService.createOrder(user_id, req.body)

  res.json({
    message: ORDERS_MESSAGES.CREATE_ORDER_SUCCESSFULLY,
    data: result
  })
}

// export const updateCityController = async (req: Request<ParamsDictionary, any, CityReqBody>, res: Response) => {
//   const city_id = req.params.id

//   const result = await citysService.updateCity(city_id, req.body)

//   res.json({
//     message: CITYS_MESSAGES.CREATE_CITY_SUCCESSFULLY,
//     data: result
//   })
// }

// export const getDetailCityController = async (req: Request, res: Response) => {
//   const city_id = req.params.id

//   const result = await citysService.getDetailCity(city_id)

//   res.json({
//     message: CITYS_MESSAGES.CREATE_CITY_SUCCESSFULLY,
//     data: result
//   })
// }

// export const deleteCityController = async (req: Request, res: Response) => {
//   const city_id = req.params.id

//   const result = await citysService.deleteCity(city_id)

//   res.json({
//     message: CITYS_MESSAGES.CREATE_CITY_SUCCESSFULLY,
//     data: result
//   })
// }

// export const getAllCityController = async (req: Request, res: Response) => {
//   const params = {
//     page: Number(req.query.page as string) || 1,
//     limit: Number(req.query.limit as string) || 3,
//     search: (req.query.search as string) || ''
//   }
//   const result = await citysService.getAllCity(params)

//   res.json({
//     message: CITYS_MESSAGES.CREATE_CITY_SUCCESSFULLY,
//     data: result
//   })
// }
