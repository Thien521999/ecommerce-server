import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  getMeByIdController,
  getMeController,
  getUsersController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { fiterMiddeware } from '~/middlewares/common.middewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdatedMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

/*
 * Desciption. Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, account:string, password:string}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/*
 * Desciption. Login a user
 * Path: /login
 * Method: POST
 * Body: { email:string, password:string, fcm_token: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
 * Desciption. Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/*
 * Desciption. Verify email when user client click on the link email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/*
 * Desciption. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Header: { email: string }
 * Body: {}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/*
 * Desciption. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Header: { forgot_password_token: string }
 * Body: {}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/*
 * Desciption. reset password
 * Path: /reset-password
 * Method: POST
 * Header: { forgot_password_token: string, password: string, confirm_password: string }
 * Body: {}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/*
 * Desciption. Refresh Token
 * Path: /refresh-token
 * Method: POST
 * Header: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/*
 * Desciption. Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/*
 * Desciption. Get my profile by id
 * Path: /me/edadessd
 * Method: GET
 * Header:
 */
usersRouter.get('/me/:_id', wrapRequestHandler(getMeByIdController))

/*
 * Desciption. Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  fiterMiddeware<UpdatedMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'avatar',
    'cover_photo',
    'isFirstLogin'
  ]),
  wrapRequestHandler(updateMeController)
)

/*
 * Desciption. Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: {old_password: string, password: string, confirm_password: string}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/*
 * Desciption. Resend verify email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/*
 * Desciption. Get all active users
 * Path: /all
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.get('/all', accessTokenValidator, wrapRequestHandler(getUsersController))

export default usersRouter
