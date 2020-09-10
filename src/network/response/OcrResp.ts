export interface Line {
  words: string
}

export interface BaiduOcrResult {
  log_id: number
  words_result_num: number
  words_result: Line[]
}

// 标准版每次5w次，有效期12个月
export const BaiduOcrErrorCode = {
  // access_token无效
  INVALID_TOKEN: 110,
  // access_token过期
  TOKEN_TIMEOUT: 111,
  // 上传的图片大小错误，现阶段我们支持的图片大小为：base64编码后小于4M，分辨率不高于4096*4096，请重新上传图片
  SIZE_ERROR: 216202,
  // 当天次数用尽
  DAY_ZERO: 17,
  // 所有次数用尽
  ALL_ZERO: 19
}

export interface BaiduOcrError {
  error_code: number
  error_msg: string
}
