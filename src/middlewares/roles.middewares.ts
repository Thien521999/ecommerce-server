import { checkSchema } from 'express-validator'
import { CONFIG_PERMISSIONS } from '~/constants/config'
import { ROLES_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { flattenPermissions } from '~/utils/common'
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
        optional: false,
        isArray: {
          errorMessage: 'permissions must be an array'
        },
        custom: {
          options: (value: string[]) => {
            if (!Array.isArray(value)) return false

            const ALL_PERMISSIONS = flattenPermissions(CONFIG_PERMISSIONS)

            for (const p of value) {
              if (!ALL_PERMISSIONS.includes(p)) {
                throw new Error(`Invalid permission: ${p}`)
              }
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
