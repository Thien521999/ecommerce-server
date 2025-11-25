import { ObjectId } from 'mongodb'
import { REVIEWS_MESSAGES } from '~/constants/messages'
import { ReviewReqBody } from '~/models/requests/Review.request'
import Review from '~/models/schemas/review.schema'
import databaseService from './database.services'

class ReviewsService {
  async createReview(user_id: string, body: ReviewReqBody) {
    const result = await databaseService.reviews.insertOne(
      new Review({
        user_id: new ObjectId(user_id),
        product_id: new ObjectId(body.product_id),
        content: body.content,
        start: +body.start
      })
    )

    const review = await databaseService.reviews.findOne({
      _id: result.insertedId
    })

    return review
  }
  async updateReview(review_id: string, body: ReviewReqBody) {
    const review = await databaseService.reviews.findOneAndUpdate(
      {
        _id: new ObjectId(review_id)
      },
      {
        $set: {
          ...body,
          product_id: new ObjectId(body.product_id)
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return review.value
  }
  async getDetailReview(review_id: string) {
    const review = await databaseService.reviews.findOne({
      _id: new ObjectId(review_id)
    })

    return review
  }
  async deleteReview(review_id: string) {
    await databaseService.reviews.deleteOne({
      _id: new ObjectId(review_id)
    })

    return {
      message: REVIEWS_MESSAGES.DELETE_REVIEW_SUCCESS
    }
  }
  async getAllReview(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.reviews.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const reviews = await databaseService.reviews.find(query).skip(skip).limit(limit).toArray()

    return {
      message: REVIEWS_MESSAGES.GET_ALL_REVIEW_SUCCESSFULLY,
      data: {
        reviews,
        page,
        limit,
        total_page
      }
    }
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
