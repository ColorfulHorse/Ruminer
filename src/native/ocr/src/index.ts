import { loadAddonFile } from '@/utils/NativeUtil'

const ocr = loadAddonFile('ocr')

// const ocr = {
//   init: (langPath: string):void => {
//     ocr.init(langPath)
//   },
//   loadLanguage: (lang: string): number => {
//     return ocr.loadLanguage(lang)
//   },
//   recognize: (base64: string): string => {
//     return ocr.recognize(base64)
//   },
//   destroy: (): void => {
//     return ocr.destroy()
//   }
// }

export default {
  init: (langPath: string) => {
    ocr.init(langPath)
  },
  loadLanguage: (lang: string): number => {
    return ocr.loadLanguage(lang)
  },
  recognize: (base64: string): string => {
    return ocr.recognize(base64)
  },
  destroy: () => {
    return ocr.destroy()
  }
}
