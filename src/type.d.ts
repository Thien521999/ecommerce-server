// de mo rong kieu du lieu cua typescript
import 'express'
import { TokenPayload } from './models/requests/User.requests'
// import Blog from './models/schemas/Blog.schema'
import User from './models/schemas/User.schema'
import Role from './models/schemas/Role.schema'
// import Province from './models/schemas/Province.schema'

declare module 'express' {
  interface Request {
    user?: User
    role?: Role
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    // expiresIn?: string | number | undefined
    // blog?: Blog
    // province?: Province
  }
}
