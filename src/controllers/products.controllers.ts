import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { CreateProductReqBody, UpdateProductReqBody } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import productsServices from '~/services/products.services'

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await productsServices.createProduct(user_id, req.body)

  res.json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESSFULLY,
    data: result
  })
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response
) => {
  const product_id = req.params.id
  const result = await productsServices.updateProduct(product_id, req.body)

  res.json({
    message: PRODUCTS_MESSAGES.UPDATED_PRODUCT_SUCCESSFULLY,
    data: result
  })
}

export const getDetailProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const product_id = req.params.id
  const result = await productsServices.getDetailProduct(product_id)

  res.json({
    message: PRODUCTS_MESSAGES.GET_DETAIL_PRODUCT_SUCCESSFULLY,
    data: result
  })
}

export const getAllProductsController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const params = req.query

  const result = await productsServices.getAllProducts(user_id, params)

  res.json({
    message: PRODUCTS_MESSAGES.GET_ALL_PRODUCT_SUCCESSFULLY,
    data: result
  })
}

export const deleteProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const product_id = req.params.id
  const result = await productsServices.deleteProduct(product_id)

  res.json(result)
}

export const getAllProductLikedController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const params = req.query
  const limit = Number(params.limit)
  const page = Number(params.page)
  const search = String(params.search) || ''

  const result = await productsServices.getAllProductLiked(user_id, { page, limit, search })

  res.json(result)
}

export const getAllProductViewedController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const params = req.query
  const limit = Number(params.limit)
  const page = Number(params.page)
  const search = String(params.search) || ''

  const result = await productsServices.getAllProductViewed(user_id, { page, limit, search })

  res.json(result)
}

export const likeProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id

  const result = await productsServices.likeProduct(user_id, product_id)

  res.json({
    message: result.message
    // data: null
  })
}

export const unlikeProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id

  const result = await productsServices.unlikeProduct(user_id, product_id)

  res.json({
    message: result.message
    // data: null
  })
}

export const deleteManyProductController = async (req: Request, res: Response) => {
  const productIds = req.body.productIds

  const result = await productsServices.deleteManyProduct(productIds)

  res.json({
    message: result.message
    // data: null
  })
}
