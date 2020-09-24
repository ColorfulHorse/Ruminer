#include <napi.h>
#include <string>
#include "include/lib.h"
#pragma comment(lib, "tesseract41.lib")

using namespace Napi;

void Initialize(const CallbackInfo& info) {
    Env env = info.Env();
    init(info[0].ToString());
}

Number LoadLang(const CallbackInfo& info) {
    Env env = info.Env();
    int ret = loadLanguage(info[0].ToString());
    return Napi::Number::New(env, ret);
}

String Recognize(const CallbackInfo& info) {
    Env env = info.Env();
    string text = recognize(info[0].ToString());
    String res = Napi::String::New(env, text);
    delete[] text.c_str();
    return res;
}

void Destroy(const CallbackInfo& info) {
    destroy();
}

// 设置类似于 exports = {key:value}的模块导出
Object Init(Env env, Object exports) {
    exports["init"] = Function::New(env, Initialize);
    exports["loadLanguage"] = Function::New(env, LoadLang);
    exports["recognize"] = Function::New(env, Recognize);
    exports["destroy"] = Function::New(env, Destroy);
    return exports;
}

NODE_API_MODULE(ocr, Init)
