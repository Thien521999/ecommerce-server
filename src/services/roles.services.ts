import { ObjectId } from 'mongodb'
import { RoleReqBody } from '~/models/requests/Role.request'
import Role from '~/models/schemas/Role.schema'
import databaseService from './database.services'
import { ROLES_MESSAGES } from '~/constants/messages'

class RolesService {
  async createRole(user_id: string, body: RoleReqBody) {
    const result = await databaseService.roles.insertOne(
      new Role({
        user_id: new ObjectId(user_id),

        name: body.name,
        permissions: body.permissions
      })
    )

    const role = await databaseService.roles.findOne({
      _id: result.insertedId
    })

    return role
  }
  async updateRole(role_id: string, body: RoleReqBody) {
    const role = await databaseService.roles.findOneAndUpdate(
      {
        _id: new ObjectId(role_id)
      },
      {
        $set: {
          ...body
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return role.value
  }
  async getDetailRole(role_id: string) {
    const role = await databaseService.roles.findOne({
      _id: new ObjectId(role_id)
    })

    return role
  }
  async deleteRole(role_id: string) {
    await databaseService.roles.deleteOne({
      _id: new ObjectId(role_id)
    })

    return {
      message: ROLES_MESSAGES.DELETE_ROLE_SUCCESS
    }
  }
  async getAllRole(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params

    // Query theo field, ví dụ: name
    const query: Record<string, any> = {}

    // $regex: search: tìm các document có trường name khớp với biểu thức chính quy search.
    // $options: 'i': không phân biệt hoa/thường (case-insensitive).
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.roles.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const roles = await databaseService.roles.find(query).skip(skip).limit(limit).toArray()

    return {
      message: ROLES_MESSAGES.GET_ALL_ROLE,
      data: {
        roles,
        page,
        limit,
        total_page
      }
    }
  }
}

const rolesService = new RolesService()
export default rolesService
