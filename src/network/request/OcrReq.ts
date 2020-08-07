export class BaiduOcrReq {
  private image: string
  private language_type?: string
  private detect_language: string = 'false'

  constructor(image: string, language_type?: string) {
    this.image = image
    this.language_type = language_type
    if (!language_type) {
      this.detect_language = 'true'
    }
  }
}
