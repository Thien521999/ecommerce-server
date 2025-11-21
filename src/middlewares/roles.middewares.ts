import { checkSchema } from 'express-validator'
import { ROLES_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const roleBodyValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: ROLES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ROLES_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const role = await databaseService.roles.findOne({ name: value })

            if (role) {
              throw new Error(ROLES_MESSAGES.NAME_ALREADY_EXISTS)
            }

            return true
          }
        }
      },
      permissions: {
        notEmpty: {
          errorMessage: ROLES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ROLES_MESSAGES.NAME_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
