export interface BaiduToken {
  refresh_token: string
  expires_in: number
  scope: string
  session_key: string
  access_token: string
  session_secret: string
  create_time: number
  error: string
  error_description: string
}
