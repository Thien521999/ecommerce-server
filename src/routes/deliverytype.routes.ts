import { Router } from 'express'
import {
  createDeliveryTypeController,
  deleteDeliveryTypeController,
  getAllDeliveryTypeController,
  getDeliveryTypeController,
  updateDeliveryTypeTypeController
} from '~/controllers/deliverytype.controllers'
import { deliverytypeBodyValidator } from '~/middlewares/deliverytype.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const deliverytypeRouter = Router()

deliverytypeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  deliverytypeBodyValidator,
  wrapRequestHandler(createDeliveryTypeController)
)

deliverytypeRouter.put(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  deliverytypeBodyValidator,
  wrapRequestHandler(updateDeliveryTypeTypeController)
)

deliverytypeRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getDeliveryTypeController)
)

deliverytypeRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteDeliveryTypeController)
)

deliverytypeRouter.get(
  '/all',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAllDeliveryTypeController)
)

export default deliverytypeRouter
