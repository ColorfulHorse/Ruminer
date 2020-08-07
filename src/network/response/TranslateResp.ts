export interface BaiduTranslateResult {
  src: string
  dst: string
}

export interface BaiduTranslateResp {
  from: string
  to: string
  trans_result: BaiduTranslateResult[]
  error_code: number | undefined
}


