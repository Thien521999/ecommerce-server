import { Router } from 'express'
import {
  createProductTypeController,
  deleteProducttypeController,
  getAllProducttypesController,
  getProducttypeController,
  updateProductTypeController
} from '~/controllers/producttypes.controllers'
import { producttypeBodyValidator } from '~/middlewares/producttypes.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const producttypesRouter = Router()

producttypesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  producttypeBodyValidator,
  wrapRequestHandler(createProductTypeController)
)

producttypesRouter.put(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  producttypeBodyValidator,
  wrapRequestHandler(updateProductTypeController)
)

producttypesRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getProducttypeController)
)

producttypesRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteProducttypeController)
)

producttypesRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAllProducttypesController)
)

export default producttypesRouter
