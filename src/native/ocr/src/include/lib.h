#ifndef OCR_LIB_H
#define OCR_LIB_H

#include "include/tesseract/baseapi.h"
#include "include/leptonica/allheaders.h"
#include <string>
#include "opencv2/opencv.hpp"

using namespace std;
using namespace tesseract;

void init(string path);

int loadLanguage(string lang);

vector<string> recognize(string base64);

void destroy();

cv::Mat pixToMat(Pix *pix);

Pix *mat8ToPix(cv::Mat *mat8);

static const std::string base64_chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
"abcdefghijklmnopqrstuvwxyz"
"0123456789+/";

std::string base64_decode(std::string const& encoded_string);

std::vector<cv::Rect> getRect(cv::Mat srcImage);
#endif
