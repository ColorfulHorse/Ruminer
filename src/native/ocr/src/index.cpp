#include <napi.h>
#include <string>
#include "include/lib.h"

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

Array Recognize(const CallbackInfo& info) {
    Env env = info.Env();
    vector<string> textList = recognize(info[0].ToString());
    Array array = Array::New(env);
    for (size_t idx = 0; idx < textList.size(); idx++) {
        // The HandleScope is recommended especially when the loop has many
        // iterations.
        Napi::HandleScope scope(env);
        array[idx] = Napi::String::New(env, textList[idx]);
    }
    return array;
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
    // exports["test"] = Function::New(env, test);
    return exports;
}

NODE_API_MODULE(ocr, Init)
