import { checkSchema } from 'express-validator'
import { PRODUCTTYPES_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const producttypeBodyValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: PRODUCTTYPES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: PRODUCTTYPES_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const city = await databaseService.producttypes.findOne({ name: value })

            if (city) {
              throw new Error(PRODUCTTYPES_MESSAGES.NAME_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      slug: {
        notEmpty: {
          errorMessage: PRODUCTTYPES_MESSAGES.SLUG_IS_REQUIRED
        },
        isString: {
          errorMessage: PRODUCTTYPES_MESSAGES.SLUG_MUST_BE_A_STRING
        },
        matches: {
          options: [/^[a-z0-9-]+$/],
          errorMessage: PRODUCTTYPES_MESSAGES.SLUG_INVALID
        },
        custom: {
          options: async (value) => {
            const exists = await databaseService.producttypes.findOne({ slug: value })
            if (exists) {
              throw new Error(PRODUCTTYPES_MESSAGES.SLUG_ALREADY_EXISTS)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
