export class BaiduOcrReq {
  private image: string
  private language_type?: string
  private detect_language = 'false'

  constructor(image: string, languageType?: string) {
    this.image = image
    this.language_type = languageType
    if (!languageType) {
      this.detect_language = 'true'
    }
  }
}
