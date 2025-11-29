import { Router } from 'express'
import {
  createPaymentTypeController,
  deletePaymentTypeController,
  getAllPaymentTypeController,
  getPaymentTypeController,
  updatePaymentTypeController
} from '~/controllers/paymenttype.controllers'
import { paymenttypeBodyValidator } from '~/middlewares/paymenttype.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const paymenttypeRouter = Router()

paymenttypeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  paymenttypeBodyValidator,
  wrapRequestHandler(createPaymentTypeController)
)

paymenttypeRouter.put(
  '/update/:id',
  accessTokenValidator,
  verifiedUserValidator,
  paymenttypeBodyValidator,
  wrapRequestHandler(updatePaymentTypeController)
)

paymenttypeRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getPaymentTypeController))

paymenttypeRouter.delete(
  '/delete/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deletePaymentTypeController)
)

paymenttypeRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllPaymentTypeController))

export default paymenttypeRouter
