#include <lib.h>

TessBaseAPI *api = nullptr;
string dataPath = nullptr;

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
    l_int32 size1;
    size_t size2;
    l_uint8* source = decodeBase64(base64.c_str(), strlen(base64.c_str()), &size1);
    l_uint8* data = zlibUncompress(source, size1, &size2);
    PIX * pix = pixReadMem(data, size2);
    lept_free(source);
    lept_free(data);
    api->SetImage(pix);
    char* result = api->GetUTF8Text();
    pixDestroy(&pix);
    return string(result);
}

void destroy() {
    if (api != nullptr) {
        api->End();
    }
    dataPath = nullptr;
}