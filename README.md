## 基于ocr的动态文字翻译工具，可用于游戏、视频，基于electron+vue开发  


## todo list:
- 添加检测频率设置
- 禁止盈利用户协议弹窗
- 接入多个翻译api，美化ui
- 添加NLP
- 使用开源库替换计费api

## bug list:
- win32 api获取窗口位置时，vs全屏状态top left值为 -9 -9
- 窗口resizable设为false时mouseenter mouseleave事件有时无效

## electron bug list:
- [webSecurity false 无效](https://github.com/electron/electron/issues/23664)
- [getSize 多出1px](https://github.com/electron/electron/issues/25295)
- [透明窗口拖出屏幕黑屏](https://github.com/electron/electron/issues/23215)

## 流程整理
捕获单个窗口的画面检测文字
- main页面获取可用媒体源list
- 发送到主进程，弹出视频源选择window，选择完以后发送结果到主进程
- 主进程调用win32 api获取选中窗口位置信息，弹出captureWin用于裁剪捕获区域
- 弹出结果显示窗口(ContentWin)，开始进行检测
- 某些游戏全屏以及暴风影音全屏时无法使文字窗口浮在最上层
- tesseract-ocr抗干扰能力差，只有在纯色背景下才较为准确，需要做预处理
