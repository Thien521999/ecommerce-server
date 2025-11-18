import { Router } from 'express'
import {
  createProductController,
  deleteManyProductController,
  deleteProductController,
  getAllProductLikedController,
  getAllProductsController,
  getAllProductViewedController,
  getDetailProductController,
  likeProductController,
  unlikeProductController,
  updateProductController
} from '~/controllers/products.controllers'
import {
  createProductValidator,
  productIdBodyValidator,
  productIdsBodyValidator,
  productIdValidator,
  updateProductValidator
} from '~/middlewares/products.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateProductReqBody } from '~/models/requests/Product.requests'
import { wrapRequestHandler } from '~/utils/handler'
import { fiterMiddeware } from '~/middlewares/common.middewares'

const productsRouter = Router()

productsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createProductValidator,
  wrapRequestHandler(createProductController)
)

productsRouter.put(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  updateProductValidator,
  fiterMiddeware<UpdateProductReqBody>([
    'name',
    'slug',
    'image',
    'price',
    'countInStock',
    'description',
    'discount',
    'discountStartDate',
    'discountEndDate',
    'sold',
    'totalLikes',
    'status',
    'views'
  ]),
  wrapRequestHandler(updateProductController)
)

productsRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  wrapRequestHandler(getDetailProductController)
)

productsRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  wrapRequestHandler(deleteProductController)
)

productsRouter.get(
  '/liked/me',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAllProductLikedController)
)

productsRouter.get(
  '/viewed/me',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAllProductViewedController)
)

productsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllProductsController))

productsRouter.post(
  '/like',
  accessTokenValidator,
  verifiedUserValidator,
  productIdBodyValidator,
  wrapRequestHandler(likeProductController)
)

productsRouter.post(
  '/unlike',
  accessTokenValidator,
  verifiedUserValidator,
  productIdBodyValidator,
  wrapRequestHandler(unlikeProductController)
)

productsRouter.delete(
  '/delete-many',
  accessTokenValidator,
  verifiedUserValidator,
  productIdsBodyValidator,
  wrapRequestHandler(deleteManyProductController)
)

export default productsRouter
