#include "include/lib.h"

TessBaseAPI *api = nullptr;
string dataPath = "";

void init(string path) {
    if (api == nullptr) {
        api = new TessBaseAPI();
    }
    dataPath = path;
}

int loadLanguage(string lang) {
    return api->Init(dataPath.c_str(), lang.c_str());
}

string recognize(string base64) {
    l_int32 size;
    l_uint8* source = decodeBase64(base64.c_str(), strlen(base64.c_str()), &size);
    PIX * pix = pixReadMem(source, size);
    lept_free(source);
    api->SetImage(pix);
    char* result = api->GetUTF8Text();
    pixDestroy(&pix);
    return string(result);
}

void destroy() {
    if (api != nullptr) {
        api->End();
        delete api;
        api = nullptr;
    }
    dataPath = "";
}
