export default interface TranslateStore {
    // 源语言
    source: string
    // 目标语言
    target: string
    // 翻译后的文本
    resultText: string
    baiduOcrSecret: string
    baiduOcrApiKey: string
    baiduTransAppId: string
    baiduTransSecret: string
}
