import { Router } from 'express'
import {
  createCityController,
  deleteCityController,
  getAllCityController,
  getDetailCityController,
  updateCityController
} from '~/controllers/citys.controllers'
import { cityBodyValidator } from '~/middlewares/citys.middewares'
import { fiterMiddeware } from '~/middlewares/common.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { CityReqBody } from '~/models/requests/City.request'
import { wrapRequestHandler } from '~/utils/handler'

const citiesRouter = Router()

citiesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  cityBodyValidator,
  wrapRequestHandler(createCityController)
)

citiesRouter.put(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  cityBodyValidator,
  fiterMiddeware<CityReqBody>(['name']),
  wrapRequestHandler(updateCityController)
)

citiesRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getDetailCityController))

citiesRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteCityController))

citiesRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllCityController))

export default citiesRouter
