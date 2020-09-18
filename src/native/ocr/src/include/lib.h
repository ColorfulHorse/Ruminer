#ifndef OCR_LIB_H
#define OCR_LIB_H

#include "include/tesseract/baseapi.h"
#include "include/leptonica/allheaders.h"
#include <string>

using namespace std;
using namespace tesseract;

void init(string path);

int loadLanguage(string lang);

string recognize(string base64);

void destroy();

#endif 