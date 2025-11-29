import { Router } from 'express'
import {
  createRoleController,
  deleteRoleController,
  getAllRoleController,
  getDetailRoleController,
  updateRoleController
} from '~/controllers/role.controllers'
import { fiterMiddeware } from '~/middlewares/common.middewares'
import { roleBodyValidator } from '~/middlewares/roles.middewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { RoleReqBody } from '~/models/requests/Role.request'
import { wrapRequestHandler } from '~/utils/handler'

const rolesRouter = Router()

rolesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  roleBodyValidator,
  wrapRequestHandler(createRoleController)
)

rolesRouter.put(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  roleBodyValidator,
  fiterMiddeware<RoleReqBody>(['name', 'permissions']),
  wrapRequestHandler(updateRoleController)
)

rolesRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getDetailRoleController))

rolesRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteRoleController))

rolesRouter.get('/all', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAllRoleController))

export default rolesRouter
