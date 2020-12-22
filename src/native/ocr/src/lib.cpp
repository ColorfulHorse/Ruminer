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
    int ret = api->Init(dataPath.c_str(), lang.c_str(), OEM_LSTM_ONLY);;
    if (ret == 0) {
        // api->SetSourceResolution(96);
        // api->
        // api->SetPageSegMode(PSM_SINGLE_BLOCK);
    }
    return ret;
}

string recognize(string base64) {
    // l_int32 size;
    // l_uint8* source = decodeBase64(base64.c_str(), strlen(base64.c_str()), &size);
    // PIX * pix = pixReadMem(source, size);
    // pix = pixScale(pix, 4, 4);
    // lept_free(source);

    // PIX * pix = pixRead("D:/code/web/Ruminer/public/test2.png");
    string decoded_string = base64_decode(base64);
    vector<uchar> data(decoded_string.begin(), decoded_string.end());
    cv::Mat img = cv::imdecode(data, cv::IMREAD_UNCHANGED);
    // cv::Mat img = pixToMat(pix);
    // cv::imwrite("D:/code/web/Ruminer/public/clone.jpg", img);
    cv::cvtColor(img, img, cv::COLOR_BGR2GRAY);
    cv::adaptiveThreshold(img, img, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, 7, -30);
    // cv::imwrite("D:/code/web/Ruminer/public/binary.jpg", img);
    PIX * pix = mat8ToPix(&img);
    // pix = pixConvertRGBToGray(pix, 0.299f, 0.587f, 0.114f);
    // pixWriteJpeg("D:/code/web/Ruminer/public/gray.jpg", pix, 100, 0);
    // PIX *pixt, *pixd;
    // pixOtsuAdaptiveThreshold(pix, pix->w, pix->h, 7, 7, 0.1f, &pixt, &pixd);
    // pixSauvolaBinarizeTiled(pix, 11, 0.2, 1, 1, NULL, &pixd);
    // pixWriteJpeg("D:/code/web/Ruminer/public/target.jpg", pixd, 100, 0);
    api->SetImage(pix);
    api->SetSourceResolution(96);
    string result = api->GetUTF8Text();
    pixDestroy(&pix);
    return result;
}

void destroy() {
    if (api != nullptr) {
        api->End();
        delete api;
        api = nullptr;
    }
    dataPath = "";
}

cv::Mat pixToMat(Pix *pix) {
    int width = pixGetWidth(pix);
    int height = pixGetHeight(pix);
    int depth = pixGetDepth(pix);

    cv::Mat mat(cv::Size(width, height), depth == 1 ? CV_8UC1 : CV_8UC3);

    for (uint32_t y = 0; y < height; ++y) {
        for (uint32_t x = 0; x < width; ++x) {
            if (depth == 1) {
                l_uint32 val;
                pixGetPixel(pix, x, y, &val);
                mat.at<uchar>(cv::Point(x, y)) = static_cast<uchar>(255 * val);
            } else {
                l_int32 r, g, b;
                pixGetRGBPixel(pix, x, y, &r, &g, &b);

                cv::Vec3b color(b, g, r);
                mat.at<cv::Vec3b>(cv::Point(x, y)) = color;
            }
        }
    }

    return mat;
}

Pix *mat8ToPix(cv::Mat *mat8) {
    Pix *pixd = pixCreate(mat8->size().width, mat8->size().height, 8);
    for(int y=0; y<mat8->rows; y++) {
        for(int x=0; x<mat8->cols; x++) {
            pixSetPixel(pixd, x, y, (l_uint32) mat8->at<uchar>(y,x));
        }
    }
    return pixd;
}

static inline bool is_base64(unsigned char c) {
    return (isalnum(c) || (c == '+') || (c == '/'));
}

std::string base64_decode(std::string const& encoded_string) {
    int in_len = encoded_string.size();
    int i = 0;
    int j = 0;
    int in_ = 0;
    unsigned char char_array_4[4], char_array_3[3];
    std::string ret;
    while (in_len-- && (encoded_string[in_] != '=') && is_base64(encoded_string[in_])) {
        char_array_4[i++] = encoded_string[in_]; in_++;
        if (i == 4) {
            for (i = 0; i < 4; i++)
                char_array_4[i] = base64_chars.find(char_array_4[i]);
            char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
            char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
            char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];
            for (i = 0; (i < 3); i++)
                ret += char_array_3[i];
            i = 0;
        }
    }
    if (i) {
        for (j = i; j < 4; j++)
            char_array_4[j] = 0;
        for (j = 0; j < 4; j++)
            char_array_4[j] = base64_chars.find(char_array_4[j]);

        char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
        char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
        char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];
        for (j = 0; (j < i - 1); j++) ret += char_array_3[j];
    }
    return ret;
}
