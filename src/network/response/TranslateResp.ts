export interface BaiduTranslateResult {
  src: string
  dst: string
}

export const BaiduTranslateErrorCode = {
  // 标准版 完全免费，不限使用字符量（QPS=1）；
  // 高级版 每月前200万字符免费，超出后仅收取超出部分费用（QPS=10），49元/百万字符；
  SUCCEED: 52000,
  // 请检查您的appid是否正确，或者服务是否开通
  INVALID_ACCESS: 52003,
  // 认证未通过或未生效,请前往我的认证查看认证进度
  AUTH_FAILED: 90107,
  // 账户余额不足
  BALANCE_OVER: 54004,
  // 服务当前已关闭
  SERVER_CLOSED: 58002,
  // 系统风控增加了IP校验规则，如同一IP当日使用多个APPID发送翻译请求，则该IP将被封禁当日请求权限，次日解封。
  IP_LOCKED: 58003
}

export interface BaiduTranslateResp {
  from: string
  to: string
  trans_result: BaiduTranslateResult[]
  error_code: number | undefined
}
