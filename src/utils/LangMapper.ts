export default class LangMapper {
  static readonly AUTO = 'AUTO'

  static map = new Map<string, Lang>([
    ['eng', { name: '英语', alias: 'en', baiduOcr: 'ENG', baiduTranslate: 'en' }],
    ['jpn', { name: '日语', alias: 'jp', baiduOcr: 'JAP', baiduTranslate: 'jp' }],
    ['chi_sim', { name: '中文', alias: 'zh', baiduOcr: 'CHN_ENG', baiduTranslate: 'zh' }],
    ['kor', { name: '韩语', alias: 'kor', baiduOcr: 'KOR', baiduTranslate: 'kor' }],
    ['rus', { name: '俄语', alias: 'ru', baiduOcr: 'RUS', baiduTranslate: 'ru' }],
    ['fra', { name: '法语', alias: 'fre', baiduOcr: 'FRE', baiduTranslate: 'fra' }],
    ['spa', { name: '西班牙语', alias: 'spa', baiduOcr: 'SPA', baiduTranslate: 'spa' }],
    ['por', { name: '葡萄牙语', alias: 'pt', baiduOcr: 'POR', baiduTranslate: 'pt' }],
    ['ita', { name: '意大利语', alias: 'it', baiduOcr: 'ITA', baiduTranslate: 'it' }],
    ['deu', { name: '德语', alias: 'ger', baiduOcr: 'GER', baiduTranslate: 'de' }]
  ])

  static getLang(source: string): Lang | undefined {
    return this.map.get(source)
  }

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
