import { checkSchema } from 'express-validator'
import { PAYMENT_TYPES } from '~/constants/config'
import { PAYMENT_TYPE_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const paymenttypeBodyValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: PAYMENT_TYPE_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: PAYMENT_TYPE_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const paymenttype = await databaseService.paymenttype.findOne({ name: value })

            if (paymenttype) {
              throw new Error(PAYMENT_TYPE_MESSAGES.NAME_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      type: {
        notEmpty: {
          errorMessage: PAYMENT_TYPE_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: PAYMENT_TYPE_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (!Object.values(PAYMENT_TYPES).includes(value)) {
              throw new Error(PAYMENT_TYPE_MESSAGES.INVALID_PAYMENT_TYPE)
            }
            const paymenttype = await databaseService.paymenttype.findOne({ type: value })

            if (paymenttype) {
              throw new Error(PAYMENT_TYPE_MESSAGES.TYPE_ALREADY_EXISTS)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
