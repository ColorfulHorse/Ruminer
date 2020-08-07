export interface BaiduTransResult {
  src: string;
  dst: string;
}

export interface BaiduTranslateResp {
  from: string;
  to: string;
  trans_result: BaiduTransResult[];
  error_code: number | undefined
}


