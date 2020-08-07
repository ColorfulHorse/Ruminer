export default class LangMapper {
  static map = new Map<string, Lang>([
    ['eng', { baidu: 'en' }],
    ['jpn', { baidu: 'jp' }],
    ['chi_sim', { baidu: 'zh' }],
    ['chi_tra', { baidu: 'cht' }]
  ])

  static toBaidu(sourceLang: string): string {
    const lang = this.map.get(sourceLang)
    if (lang) {
      return lang.baidu
    } else {
      return sourceLang
    }
  }
}

interface Lang {
  baidu: string
}
