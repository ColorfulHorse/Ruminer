export default class LangMapper {
  static readonly AUTO = 'AUTO'

  static map = new Map<string, Lang>([
    ['eng', {name: '英语', alias: 'eng', baiduOcr: 'ENG', baiduTranslate: 'en', tencent: 'en'}],
    ['jpn', {name: '日语', alias: 'jpn', baiduOcr: 'JAP', baiduTranslate: 'jp', tencent: 'ja'}],
    ['chi_sim', {name: '中文', alias: 'chi_sim', baiduOcr: 'CHN_ENG', baiduTranslate: 'zh', tencent: 'zh'}],
    ['kor', {name: '韩语', alias: 'kor', baiduOcr: 'KOR', baiduTranslate: 'kor', tencent: 'ko'}],
    ['rus', {name: '俄语', alias: 'rus', baiduOcr: 'RUS', baiduTranslate: 'ru', tencent: 'ru'}],
    ['fra', {name: '法语', alias: 'fra', baiduOcr: 'FRE', baiduTranslate: 'fra', tencent: 'fr'}]
    // ['spa', {name: '西班牙语', alias: 'spa', baiduOcr: 'SPA', baiduTranslate: 'spa', tencent: 'es'}],
    // ['por', {name: '葡萄牙语', alias: 'por', baiduOcr: 'POR', baiduTranslate: 'pt', tencent: 'pt'}],
    // ['ita', {name: '意大利语', alias: 'ita', baiduOcr: 'ITA', baiduTranslate: 'it', tencent: 'it'}],
    // ['deu', {name: '德语', alias: 'deu', baiduOcr: 'GER', baiduTranslate: 'de', tencent: 'de'}]
  ])

  static getLang(source: string): Lang {
    return this.map.get(source) ?? {
      name: source,
      alias: source,
      baiduOcr: source,
      baiduTranslate: source,
      tencent: source
    }
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
  tencent: string
}
