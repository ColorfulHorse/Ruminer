export interface TxTranslateResp {
  /**
   * 翻译后的文本
   */
  TargetText?: string

  /**
   * 源语言，详见入参Target
   */
  Source?: string

  /**
   * 目标语言，详见入参Target
   */
  Target?: string

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId?: string

  Error?: TxTranslateErr
}

export interface TxTranslateErr {
  Code: string
  Message: string
}

export const TxTranslateErrCode = {

}
