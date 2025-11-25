import { Router } from 'express'
import {
  createReviewController,
  deleteReviewController,
  getAllReviewController,
  getDetailReviewController,
  updateReviewController
} from '~/controllers/reviews.controllers'
import { fiterMiddeware } from '~/middlewares/common.middewares'
import { reviewBodyValidator } from '~/middlewares/reviews.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { ReviewReqBody } from '~/models/requests/Review.request'
import { wrapRequestHandler } from '~/utils/handler'

const reviewsRouter = Router()

reviewsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  reviewBodyValidator,
  wrapRequestHandler(createReviewController)
)

reviewsRouter.put(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  reviewBodyValidator,
  fiterMiddeware<ReviewReqBody>(['content', 'start', 'product_id']),
  wrapRequestHandler(updateReviewController)
)

reviewsRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getDetailReviewController))

reviewsRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteReviewController))

reviewsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllReviewController))

export default reviewsRouter
