import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCTTYPES_MESSAGES } from '~/constants/messages'
import { ProductTypeReqBody } from '~/models/requests/ProductType.request'
import { TokenPayload } from '~/models/requests/User.requests'
import productTypesService from '~/services/producttypes.services'

export const createProductTypeController = async (
  req: Request<ParamsDictionary, any, ProductTypeReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await productTypesService.createProductType(user_id, req.body)

  res.json({
    message: PRODUCTTYPES_MESSAGES.CREATE_PRODUCT_TYPE_SUCCESSFULLY,
    data: result
  })
}

export const updateProductTypeController = async (
  req: Request<ParamsDictionary, any, ProductTypeReqBody>,
  res: Response
) => {
  const producttype_id = req.params.id

  const result = await productTypesService.updateProducttype(producttype_id, req.body)

  res.json({
    message: PRODUCTTYPES_MESSAGES.UPDATE_PRODUCTTYPE_SUCCESSFULLY,
    data: result
  })
}

export const getProducttypeController = async (req: Request, res: Response) => {
  const producttype_id = req.params.id

  const result = await productTypesService.getDetailProducttype(producttype_id)

  res.json({
    message: PRODUCTTYPES_MESSAGES.GET_DETAIL_PRODUCTTYPE_SUCCESSFULLY,
    data: result
  })
}

export const deleteProducttypeController = async (req: Request, res: Response) => {
  const producttype_id = req.params.id

  const result = await productTypesService.deleteProducttype(producttype_id)

  res.json(result)
}

export const getAllProducttypesController = async (req: Request, res: Response) => {
  const params = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 3,
    search: (req.query.search as string) || ''
  }
  const result = await productTypesService.getAllProducttypes(params)

  res.json({
    message: PRODUCTTYPES_MESSAGES.GET_ALL_PRODUCTTYPES_SUCCESSFULLY,
    data: result
  })
}
