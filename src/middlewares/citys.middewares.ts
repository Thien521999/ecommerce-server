import { checkSchema } from 'express-validator'
import { CITYS_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const cityBodyValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CITYS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: CITYS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const city = await databaseService.citys.findOne({ name: value })

            if (city) {
              throw new Error(CITYS_MESSAGES.NAME_ALREADY_EXISTS)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const paramsValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.SLUG_IS_REQUIRED
        },
        isString: {
          errorMessage: PRODUCTS_MESSAGES.SLUG_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const city = await databaseService.citys.findOne({ name: value })

            if (city) {
              throw new Error(CITYS_MESSAGES.NAME_ALREADY_EXISTS)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
