export interface Line {
  words: string
}

export interface BaiduOcrResult {
  log_id: number
  words_result_num: number
  words_result: Line[]
  error_code: number
  error_msg: string
}
