export enum userVerifyStatus {
  Unverified, // chưa xác thực email, mặc định 0
  Verified, // đã xác thực email
  Banned // bị khoá
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

// export enum MediaType {
//   Image, // 0
//   Video // 1
// }

export enum productStatus {
  Inactive, // chưa xác thực email, mặc định 0
  Active // đã xác thực email
}
