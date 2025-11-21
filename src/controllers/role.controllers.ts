import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ROLES_MESSAGES } from '~/constants/messages'
import { RoleReqBody } from '~/models/requests/Role.request'
import { TokenPayload } from '~/models/requests/User.requests'
import rolesService from '~/services/roles.services'

export const createRoleController = async (req: Request<ParamsDictionary, any, RoleReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await rolesService.createRole(user_id, req.body)

  res.json({
    message: ROLES_MESSAGES.CREATE_ROLE_SUCCESSFULLY,
    data: result
  })
}

export const updateRoleController = async (req: Request<ParamsDictionary, any, RoleReqBody>, res: Response) => {
  const role_id = req.params.id

  const result = await rolesService.updateRole(role_id, req.body)

  res.json({
    message: ROLES_MESSAGES.UPDATE_ROLE_SUCCESSFULLY,
    data: result
  })
}

export const getDetailRoleController = async (req: Request, res: Response) => {
  const role_id = req.params.id

  const result = await rolesService.getDetailRole(role_id)

  res.json({
    message: ROLES_MESSAGES.GET_DETAIL_ROLE_SUCCESSFULLY,
    data: result
  })
}

export const deleteRoleController = async (req: Request, res: Response) => {
  const role_id = req.params.id

  const result = await rolesService.deleteRole(role_id)

  res.json({
    message: ROLES_MESSAGES.CREATE_ROLE_SUCCESSFULLY,
    data: result
  })
}

export const getAllRoleController = async (req: Request, res: Response) => {
  const params = {
    page: Number(req.query.page as string) || 1,
    limit: Number(req.query.limit as string) || 10,
    search: (req.query.search as string) || ''
  }
  const result = await rolesService.getAllRole(params)

  res.json({
    message: ROLES_MESSAGES.GET_ALL_ROLE_SUCCESSFULLY,
    data: result
  })
}
