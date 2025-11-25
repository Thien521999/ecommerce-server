import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { REVIEWS_MESSAGES } from '~/constants/messages'
import { ReviewReqBody } from '~/models/requests/Review.request'
import { TokenPayload } from '~/models/requests/User.requests'
import reviewsService from '~/services/reviews.services'

export const createReviewController = async (req: Request<ParamsDictionary, any, ReviewReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await reviewsService.createReview(user_id, req.body)

  res.json({
    message: REVIEWS_MESSAGES.ADD_REVIEW_SUCCESSFULLY,
    data: result
  })
}

export const updateReviewController = async (req: Request<ParamsDictionary, any, ReviewReqBody>, res: Response) => {
  const review_id = req.params.id

  const result = await reviewsService.updateReview(review_id, req.body)

  res.json({
    message: REVIEWS_MESSAGES.UPDATE_REVIEW_SUCCESSFULLY,
    data: result
  })
}

export const getDetailReviewController = async (req: Request, res: Response) => {
  const review_id = req.params.id

  const result = await reviewsService.getDetailReview(review_id)

  res.json({
    message: REVIEWS_MESSAGES.GET_DETAIL_REVIEW_SUCCESSFULLY,
    data: result
  })
}

export const deleteReviewController = async (req: Request, res: Response) => {
  const review_id = req.params.id

  const result = await reviewsService.deleteReview(review_id)

  res.json(result)
}

export const getAllReviewController = async (req: Request, res: Response) => {
  const params = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 3,
    search: (req.query.search as string) || ''
  }
  const result = await reviewsService.getAllReview(params)

  res.json({
    message: REVIEWS_MESSAGES.GET_ALL_REVIEW_SUCCESSFULLY,
    data: result
  })
}
