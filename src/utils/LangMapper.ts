export default class LangMapper {
  static readonly AUTO = 'AUTO'

  static map = new Map<string, Lang>([
    ['eng', { baiduOcr: 'ENG', baiduTranslate: 'en' }],
    ['jpn', { baiduOcr: 'JAP', baiduTranslate: 'jp' }],
    ['chi_sim', { baiduOcr: 'CHN_ENG', baiduTranslate: 'zh' }],
    ['chi_tra', { baiduOcr: 'CHN_ENG', baiduTranslate: 'cht' }]
  ])

  static toBaiduOcr(sourceLang: string): string {
    const lang = this.map.get(sourceLang)
    if (lang) {
      return lang.baiduOcr
    } else {
      return LangMapper.AUTO
    }
  }

  static toBaiduTranslate(sourceLang: string): string {
    const lang = this.map.get(sourceLang)
    if (lang) {
      return lang.baiduTranslate
    } else {
      return LangMapper.AUTO
    }
  }
}

interface Lang {
  baiduOcr: string
  baiduTranslate: string
}
