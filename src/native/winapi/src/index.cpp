#include <napi.h>
#include <string>
#include "include/lib.h"

using namespace Napi;

Array GetSystemFonts(const CallbackInfo& info) {
  Env env = info.Env();
  vector<string> fonts = getSystemFonts();
  Array array = Array::New(env);
  for (size_t idx = 0; idx < fonts.size(); idx++) {
    // The HandleScope is recommended especially when the loop has many
    // iterations.
    Napi::HandleScope scope(env);
    array[idx] = Napi::String::New(env, fonts[idx]);
  }
  return array;
}

// 设置类似于 exports = {key:value}的模块导出
Object Init(Env env, Object exports) {
  exports["getSystemFonts"] = Function::New(env, GetSystemFonts);
  return exports;
}

NODE_API_MODULE(winapi, Init)
