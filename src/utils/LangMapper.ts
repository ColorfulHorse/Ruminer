export default class LangMapper {
  static readonly AUTO = 'AUTO'

  static map = new Map<string, Lang>([
    ['en', { name: '英语', alias: 'en', baiduOcr: 'ENG', baiduTranslate: 'en' }],
    ['jp', { name: '日语', alias: 'jp', baiduOcr: 'JAP', baiduTranslate: 'jp' }],
    ['zh', { name: '中文', alias: 'zh', baiduOcr: 'CHN_ENG', baiduTranslate: 'zh' }],
    ['kor', { name: '韩语', alias: 'kor', baiduOcr: 'KOR', baiduTranslate: 'kor' }],
    ['ru', { name: '俄语', alias: 'ru', baiduOcr: 'RUS', baiduTranslate: 'ru' }],
    ['fre', { name: '法语', alias: 'fre', baiduOcr: 'FRE', baiduTranslate: 'fra' }],
    ['spa', { name: '西班牙语', alias: 'spa', baiduOcr: 'SPA', baiduTranslate: 'spa' }],
    ['pt', { name: '葡萄牙语', alias: 'pt', baiduOcr: 'POR', baiduTranslate: 'pt' }],
    ['it', { name: '意大利语', alias: 'it', baiduOcr: 'ITA', baiduTranslate: 'it' }],
    ['ger', { name: '德语', alias: 'ger', baiduOcr: 'GER', baiduTranslate: 'de' }]
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
  name: string
  alias: string
  baiduOcr: string
  baiduTranslate: string
}
