import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DELIVERY_TYPE_MESSAGES } from '~/constants/messages'
import { DeliveryReqBody } from '~/models/requests/Delivery.request'
import { TokenPayload } from '~/models/requests/User.requests'
import deliveryTypeService from '~/services/deliverytype.services'

export const createDeliveryTypeController = async (
  req: Request<ParamsDictionary, any, DeliveryReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await deliveryTypeService.createDeliveryType(user_id, req.body)

  res.json({
    message: DELIVERY_TYPE_MESSAGES.CREATE_DELIVERY_SUCCESSFULLY,
    data: result
  })
}

export const updateDeliveryTypeTypeController = async (
  req: Request<ParamsDictionary, any, DeliveryReqBody>,
  res: Response
) => {
  const delivery_type_id = req.params.id

  const result = await deliveryTypeService.updateDeliveryType(delivery_type_id, req.body)

  res.json({
    message: DELIVERY_TYPE_MESSAGES.UPDATE_DELIVERY_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const getDeliveryTypeController = async (req: Request, res: Response) => {
  const delivery_type_id = req.params.id

  const result = await deliveryTypeService.getDetailDeliveryType(delivery_type_id)

  res.json({
    message: DELIVERY_TYPE_MESSAGES.GET_DELIVERY_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const deleteDeliveryTypeController = async (req: Request, res: Response) => {
  const delivery_type_id = req.params.id

  const result = await deliveryTypeService.deleteDeliveryType(delivery_type_id)

  res.json({
    message: DELIVERY_TYPE_MESSAGES.DELIVERY_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const getAllDeliveryTypeController = async (req: Request, res: Response) => {
  const params = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 3,
    search: (req.query.search as string) || ''
  }
  const result = await deliveryTypeService.getAllDeliveryType(params)

  res.json(result)
}
