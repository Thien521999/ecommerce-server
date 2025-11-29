import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PAYMENT_TYPE_MESSAGES } from '~/constants/messages'
import { PaymentTypeReqBody } from '~/models/requests/PaymentType.request'
import { TokenPayload } from '~/models/requests/User.requests'
import paymentTypeService from '~/services/paymenttype.services'

export const createPaymentTypeController = async (
  req: Request<ParamsDictionary, any, PaymentTypeReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await paymentTypeService.createPaymentType(user_id, req.body)

  res.json({
    message: PAYMENT_TYPE_MESSAGES.CREATE_PAYMENT_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const updatePaymentTypeController = async (
  req: Request<ParamsDictionary, any, PaymentTypeReqBody>,
  res: Response
) => {
  const payment_type_id = req.params.id

  const result = await paymentTypeService.updatePaymentType(payment_type_id, req.body)

  res.json({
    message: PAYMENT_TYPE_MESSAGES.UPDATE_DELIVERY_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const getPaymentTypeController = async (req: Request, res: Response) => {
  const payment_type_id = req.params.id

  const result = await paymentTypeService.getDetailPaymentType(payment_type_id)

  res.json({
    message: PAYMENT_TYPE_MESSAGES.GET_PAYMENT_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const deletePaymentTypeController = async (req: Request, res: Response) => {
  const payment_type_id = req.params.id

  const result = await paymentTypeService.deletePaymentType(payment_type_id)

  res.json(result)
}

export const getAllPaymentTypeController = async (req: Request, res: Response) => {
  const params = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 3,
    search: (req.query.search as string) || ''
  }
  const result = await paymentTypeService.getAllPaymentType(params)

  res.json(result)
}
