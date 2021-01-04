import { loadAddonFile } from '@/utils/NativeUtil'

const ocr = loadAddonFile('src/native/ocr/build/Release/ocr.node', 'ocr.node')

export default {
  init: (langPath: string) => {
    ocr.init(langPath)
  },
  loadLanguage: (lang: string): number => {
    return ocr.loadLanguage(lang)
  },
  recognize: (base64: string): Array<string> => {
    return ocr.recognize(base64)
  },
  destroy: () => {
    return ocr.destroy()
  }
}
