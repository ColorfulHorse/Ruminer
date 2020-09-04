export interface BaiduToken {
  refresh_token: string
  expires_in: number
  scope: string
  session_key: string
  access_token: string
  session_secret: string
  create_time: number
}

export const BaiduTokenErrorCode = {
  invalid_client: 'invalid_client'
}

export interface BaiduTokenError {
  error: string
  error_description: string
}

