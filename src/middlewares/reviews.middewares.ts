import { checkSchema } from 'express-validator'
import { CITYS_MESSAGES, REVIEWS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const reviewBodyValidator = validate(
  checkSchema(
    {
      content: {
        notEmpty: {
          errorMessage: REVIEWS_MESSAGES.CONTENT_IS_REQUIRED
        },
        isString: {
          errorMessage: REVIEWS_MESSAGES.CONTENT_IS_REQUIRED
        }
      },
      star: {
        notEmpty: {
          errorMessage: REVIEWS_MESSAGES.STAR_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: REVIEWS_MESSAGES.STAR_MUST_BE_A_NUMBER
        }
      },
      product_id: {
        notEmpty: {
          errorMessage: REVIEWS_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: REVIEWS_MESSAGES.PRODUCT_ID_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)
