import { checkSchema } from 'express-validator'
import { DELIVERY_TYPE_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const deliverytypeBodyValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: DELIVERY_TYPE_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: DELIVERY_TYPE_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const deliverytype = await databaseService.deliverytype.findOne({ name: value })

            if (deliverytype) {
              throw new Error(DELIVERY_TYPE_MESSAGES.NAME_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: DELIVERY_TYPE_MESSAGES.PRICE_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: DELIVERY_TYPE_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
)
