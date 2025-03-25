export enum TokenKeys {
  AccessToken = "gc_access_token",
}

export enum ErrCodes {
  InvalidCredentials = "INVALID_CREDENTIALS",
  ResourceNotFound = "RESOURCE_NOT_FOUND",
  ResourceAlreadyTaken = "RESOURCE_ALREADY_TAKEN",
  LimitReached = "RESOURCE_LIMIT_REACHED",
  CaptchaNotVerified = "CAPTCHA_NOT_VERIFIED",
  Unauthorized = "ACCESS_TOKEN_UNAUTHORIZED",
}
