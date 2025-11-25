import { Router } from 'express'
import {
  createCityController,
  deleteCityController,
  getAllCityController,
  getDetailCityController,
  updateCityController
} from '~/controllers/citys.controllers'
import { createOrderController } from '~/controllers/orders.controllers'
import { cityBodyValidator } from '~/middlewares/citys.middewares'
import { fiterMiddeware } from '~/middlewares/common.middewares'
import { orderBodyValidator } from '~/middlewares/order.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { CityReqBody } from '~/models/requests/City.request'
import { wrapRequestHandler } from '~/utils/handler'

const ordersRouter = Router()

ordersRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  orderBodyValidator,
  wrapRequestHandler(createOrderController)
)

// ordersRouter.put(
//   '/:id',
//   accessTokenValidator,
//   verifiedUserValidator,
//   cityBodyValidator,
//   fiterMiddeware<CityReqBody>(['name']),
//   wrapRequestHandler(updateCityController)
// )

// ordersRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getDetailCityController))

// ordersRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteCityController))

// ordersRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllCityController))

export default ordersRouter
