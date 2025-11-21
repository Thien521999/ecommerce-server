import { ObjectId } from 'mongodb'

interface RoleType {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  permissions: string[]
  created_at?: Date
  updated_at?: Date
}

export default class Role {
  _id?: ObjectId
  user_id: ObjectId
  name: string
  permissions: string[]
  created_at: Date
  updated_at: Date

  constructor(role: RoleType) {
    const date = new Date()

    this._id = role._id
    this.user_id = role.user_id
    this.name = role.name
    this.permissions = role.permissions
    this.created_at = role.created_at || date
    this.updated_at = role.updated_at || date
  }
}
