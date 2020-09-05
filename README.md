## 基于ocr的动态文字翻译工具，可用于游戏、视频，基于electron+vue开发  


## todo list:
- 由于不同窗口在不同渲染进程，考虑不使用vuex
- 添加语句相似度过滤选项
- 接入多个翻译api，美化ui
- 添加NLP
- 使用开源库替换计费api

## bug list:
- win32 api获取窗口位置时，vs全屏状态top left值为 -9 -9

## 流程整理
捕获单个窗口的画面检测文字
- main页面获取可用媒体源list
- 发送到主进程，弹出视频源选择window，选择完以后发送结果到主进程
- 主进程调用win32 api获取选中窗口位置信息，弹出captureWin用于裁剪捕获区域
- 弹出结果显示窗口(ContentWin)，开始进行检测
