#include <napi.h>
#include <string>
#include "include/lib.h"
#include "Windows.h"
#include <cstdio>

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

string WCharToMByte(LPCWSTR lpcwszStr){
	string str;
	DWORD dwMinSize = 0;
	LPSTR lpszStr = NULL;
	dwMinSize = WideCharToMultiByte(CP_OEMCP, NULL, lpcwszStr, -1, NULL, 0, NULL, FALSE);
	if (0 == dwMinSize){
		return "";
	}
	lpszStr = new char[dwMinSize];
	WideCharToMultiByte(CP_OEMCP, NULL, lpcwszStr, -1, lpszStr, dwMinSize, NULL, FALSE);
	str = lpszStr;
	delete[] lpszStr;
	return str;
}

// TessBaseAPI *api = nullptr;

String test(const CallbackInfo& info) {
    Env env = info.Env();
    // HMODULE tess = LoadLibrary(TEXT("tesseract41.dll"));
    // HMODULE jpeg62 = LoadLibrary(TEXT("jpeg62.dll"));
    // HMODULE leptonica = LoadLibrary(TEXT("leptonica-1.78.0.dll"));
    // HMODULE libpng16 = LoadLibrary(TEXT("libpng16.dll"));
    // HMODULE lzma = LoadLibrary(TEXT("lzma.dll"));
    // HMODULE tiff = LoadLibrary(TEXT("tiff.dll"));
    // HMODULE webp = LoadLibrary(TEXT("webp.dll"));
    // HMODULE zlib1 = LoadLibrary(TEXT("zlib1.dll"));
    // LPWSTR path = new WCHAR[512];
    // LPSTR path = new char[512];
    // GetDllDirectoryA(512, path);
    // string p = WCharToMByte(path);
    // TessBaseAPI *api = new TessBaseAPI();
    // int ret = api->Init(".", "eng");
    int ret = 0;
    String res = Napi::String::New(env, to_string(ret).append("tess test"));
    
    // if (tess == nullptr) {
    //      res = Napi::String::New(env, "tess null");
    // }else {
    //      res = Napi::String::New(env, "tess not null");
    // }
    return res;
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
