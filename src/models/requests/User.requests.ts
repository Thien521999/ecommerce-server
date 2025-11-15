import { JwtPayload } from 'jsonwebtoken'
import { TokenType, userVerifyStatus } from '~/constants/enums'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: userVerifyStatus
  exp: number
  iat: number
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
  fcm_token: string
}

export interface LogoutReqbody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface ResetPasswordReqBody {
  password: string
  confirn_password: string
  forgot_password_token: string
}

export interface RefreshTokenReqbody {
  refresh_token: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface UpdatedMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  avatar?: string
  cover_photo?: string
  isFirstLogin?: boolean
}
