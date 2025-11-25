import { ObjectId } from 'mongodb'
import { TokenType, userVerifyStatus } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody, UpdatedMeReqBody } from '~/models/requests/User.requests'
// import Follower from '~/models/schemas/Follower.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: userVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshsToken({ user_id, verify, exp }: { user_id: string; verify: userVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: userVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: userVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: userVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshsToken({ user_id, verify })])
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async register(payload: RegisterReqBody, role_id: ObjectId) {
    const user_id = new ObjectId()

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: userVerifyStatus.Unverified
    })

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        role_id,
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: userVerifyStatus.Unverified
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )

    // Follow verify email
    // 1. Server send email to user
    // 2. User click link in email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token

    await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return {
      access_token,
      refresh_token,
      email_verify_token
    }
  }
  async login({ user_id, verify, fcm_token }: { user_id: string; verify: userVerifyStatus; fcm_token: string }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )

    if (fcm_token) {
      await databaseService.users.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            fcm_token: fcm_token
          }
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
    }

    return {
      access_token,
      refresh_token
    }
  }
  async logout(refresh_token: string) {
    await databaseService.refreshToken.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: userVerifyStatus.Verified }),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            email_verify_token: '',
            verify: userVerifyStatus.Verified
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])

    const [access_token, refresh_Token] = token

    const { iat, exp } = await this.decodeRefreshToken(refresh_Token)

    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_Token, iat, exp })
    )

    return {
      access_token,
      refresh_Token
    }
  }
  async forgotPassword({ user_id, verify, email }: { user_id: string; verify: userVerifyStatus; email: string }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            forgot_password_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    // gửi email
    await sendForgotPasswordEmail(email, forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }
  async refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }: {
    user_id: string
    refresh_token: string
    verify: userVerifyStatus
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshsToken({ user_id, verify, exp }),
      databaseService.refreshToken.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  async getMeById(_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }
  // async follow(user_id: string, followed_user_id: string) {
  //   const follower = await databaseService.followers.findOne({
  //     user_id: new ObjectId(user_id),
  //     followed_user_id: new ObjectId(followed_user_id)
  //   })
  //   if (follower === null) {
  //     await databaseService.followers.insertOne(
  //       new Follower({
  //         user_id: new ObjectId(user_id),
  //         followed_user_id: new ObjectId(followed_user_id)
  //       })
  //     )

  //     // Cập nhật blog_circle của user
  //     await databaseService.users.updateOne(
  //       { _id: new ObjectId(user_id) },
  //       { $addToSet: { blog_circle: new ObjectId(followed_user_id) } }
  //     )
  //     return {
  //       message: USERS_MESSAGES.FOLLOW_SUCCESS
  //     }
  //   }
  //   return {
  //     message: USERS_MESSAGES.FOLLOWED
  //   }
  // }
  // async unFollow(user_id: string, followed_user_id: string) {
  //   const follower = await databaseService.followers.findOne({
  //     user_id: new ObjectId(user_id),
  //     followed_user_id: new ObjectId(followed_user_id)
  //   })

  //   // ko tìm thấy document follower
  //   // nghĩa là chưa follow người này
  //   if (follower === null) {
  //     return {
  //       message: USERS_MESSAGES.ALREADY_UNFOLLOWED
  //     }
  //   }

  //   // tìm thấy document follower
  //   // nghĩa là đã follow người này rồi, thì tiến hành xoá document này
  //   const result = await databaseService.followers.deleteOne({
  //     user_id: new ObjectId(user_id),
  //     followed_user_id: new ObjectId(followed_user_id)
  //   })

  //   if (result.deletedCount > 0) {
  //     // Xóa khỏi blog_circle của user
  //     await databaseService.users.updateOne(
  //       { _id: new ObjectId(user_id) },
  //       { $pull: { blog_circle: new ObjectId(followed_user_id) } }
  //     )

  //     return {
  //       message: USERS_MESSAGES.UNFOLLOW_SUCCESS
  //     }
  //   }
  //   return {
  //     message: USERS_MESSAGES.NOT_FOLLOWING
  //   }
  // }
  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: userVerifyStatus.Unverified
    })

    // cập nhật lại giá trị email_verify_token trong document users
    // email_verify_token = rỗng => user đó đã verify rùi(check db)
    // email_verify_token !== rỗng => user chưa verify
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    // gửi email
    await sendVerifyRegisterEmail(email, email_verify_token)

    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }
  async getUsers({ verify, limit, page }: { verify: number; limit: number; page: number }) {
    const users = await databaseService.users
      .aggregate([
        {
          $match: {
            verify
          }
        },
        {
          $project: {
            email_verify_token: 0,
            forgot_password_token: 0,
            password: 0,
            email: 0
          }
        },
        {
          $sort: {
            created_at: -1 // Sắp xếp giảm dần theo ngày tạo
          }
        },
        {
          $skip: limit * (page - 1) // Công thức phân trang
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.users.countDocuments({})

    return {
      users,
      total_page: Math.ceil(total / limit)
    }
  }
  async updateMe(user_id: string, payload: UpdatedMeReqBody) {
    // updateOne: only update, not return document
    // findOneAndUpdate: update and return document , default tra ve document cũ
    // const _payload = payload.date_of_birth
    //   ? { ...payload, date_of_birth: new Date(payload.date_of_birth) }
    //   : { ...payload }

    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        // $set: {
        //   ...(_payload as UpdatedMeReqBody & { date_of_birth?: Date })
        // },
        $set: {
          ...payload,
          role_id: new ObjectId(payload.role_id)
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    return user
  }
}

const usersService = new UsersService()
export default usersService
