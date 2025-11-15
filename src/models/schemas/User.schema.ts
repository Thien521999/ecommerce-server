import { ObjectId } from 'mongodb'
import { userVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  password: string
  phoneNumber?: string
  address?: string
  avatar?: string

  // addresses: any

  email_verify_token?: string // jwt or '' nếu đã xác thực email
  forgot_password_token?: string // jwt or '' nếu đã xác thực email
  verify?: userVerifyStatus

  likedProducts?: ObjectId[]
  viewedProducts?: ObjectId[]

  fcm_token?: string // để gửi push notification.

  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  phoneNumber: string
  address: string
  avatar: string
  // addresses: Address[]

  email_verify_token: string
  forgot_password_token: string
  verify: userVerifyStatus

  likedProducts: ObjectId[]
  viewedProducts: ObjectId[]

  fcm_token: string

  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.phoneNumber = user.phoneNumber || ''
    this.address = user.address || ''
    this.avatar = user.avatar || ''

    // this.addresses = user.addresses

    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || userVerifyStatus.Unverified

    this.likedProducts = user.likedProducts || []
    this.viewedProducts = user.viewedProducts || []

    this.fcm_token = user.fcm_token || ''

    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
