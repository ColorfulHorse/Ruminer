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

vector<string> recognize(string base64) {
    // l_int32 size;
    // l_uint8* source = decodeBase64(base64.c_str(), strlen(base64.c_str()), &size);
    // PIX * pix = pixReadMem(source, size);
    // pix = pixScale(pix, 4, 4);
    // lept_free(source);

    // PIX * pix = pixRead("D:/code/web/Ruminer/public/test2.png");
    string decoded_string = base64_decode(base64);
    vector<uchar> data(decoded_string.begin(), decoded_string.end());
    cv::Mat img = cv::imdecode(data, cv::IMREAD_UNCHANGED);
    cv::Mat gray;
    cv::cvtColor(img, gray, cv::COLOR_BGR2GRAY);
    vector<cv::Rect> rects = getRect(gray);
    // PIX * pix = mat8ToPix(&gray);
    // api->SetImage(pix);
    // api->SetSourceResolution(96);
    vector<string> res;
    for (size_t i = 0; i < rects.size(); i++) {
        cv::Rect rect = rects[i];
        cv::Mat area(gray, rect);
        cv::threshold(area, area, 0, 255, cv::THRESH_BINARY | cv::THRESH_OTSU);
        // api->SetRectangle(rect.x, rect.y, rect.width, rect.height);
        PIX * pix = mat8ToPix(&area);
        api->SetImage(pix);
        string result = api->GetUTF8Text();
        pixDestroy(&pix);
        // if (result.length() > 2) {
        res.push_back(result);
        // }
    }
    // pixDestroy(&pix);
    return res;
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

std::vector<cv::Rect> getRect(cv::Mat gray) {
	cv::Mat gray_neg;
	// 取反值灰度
	gray_neg = 255 - gray;
	std::vector<vector<cv::Point> > regContours;
	std::vector<vector<cv::Point> > charContours;//点集

	// 创建MSER对象
	// _max_variation 最大变化率大于此值的将被忽略
	// _min_diversity 两个区域的区别小于此值将被忽略
	cv::Ptr<cv::MSER> mesr1 = cv::MSER::create(5, 20, 5000, 0.5, 0.3);
	cv::Ptr<cv::MSER> mesr2 = cv::MSER::create(5, 20, 400, 0.1, 0.3);
	std::vector<cv::Rect> bboxes1;
	std::vector<cv::Rect> bboxes2;
	// MSER+ 检测
	mesr1->detectRegions(gray, regContours, bboxes1);
	// MSER-操作
	mesr2->detectRegions(gray_neg, charContours, bboxes2);

	cv::Mat mserMapMat = cv::Mat::zeros(gray.size(), CV_8UC1);
	cv::Mat mserNegMapMat = cv::Mat::zeros(gray.size(), CV_8UC1);

	for (size_t i = 1; i < regContours.size(); i++) {
		// 根据检测区域点生成mser+结果
		const std::vector<cv::Point>& r = regContours[i];
		for (size_t j = 0; j < r.size(); j++) {
			cv::Point pt = r[j];
			mserMapMat.at<unsigned char>(pt) = 255;
		}
	}
	//MSER- 检测
	for (size_t i = 1; i < charContours.size(); i++) {
		// 根据检测区域点生成mser-结果
		const std::vector<cv::Point>& r = charContours[i];
		for (size_t j = 0; j < r.size(); j++) {
			cv::Point pt = r[j];
			mserNegMapMat.at<unsigned char>(pt) = 255;
		}
	}
	cv::Mat mserResMat;
	mserResMat = mserMapMat;
	mserResMat = mserMapMat & mserNegMapMat;	// mser+与mser-位与操作
	cv::Mat mserClosedMat;
	cv::Mat kernel = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(20, 20));
	cv::morphologyEx(mserResMat, mserClosedMat,
		cv::MORPH_CLOSE, kernel);
	// 寻找外部轮廓
	std::vector<std::vector<cv::Point> > plate_contours;
	cv::findContours(mserClosedMat, plate_contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE, cv::Point(0, 0));
	// 候选车牌区域判断输出
	std::vector<cv::Rect> candidates;
	for (size_t i = 0; i != plate_contours.size(); ++i) {
		// 求解最小外界矩形
		cv::Rect rect = cv::boundingRect(plate_contours[i]);
   		// 宽高比例
		double wh_ratio = rect.width / double(rect.height);
		if (wh_ratio > 0.5) {
            int area = rect.width * rect.height;
            int size = gray.cols * gray.rows;
            if (size/area < 300) {
                // 忽略太小的区域
                const int margin = 5;
                int l = rect.x - margin < 0 ? 0 : rect.x - margin;
                int t = rect.y - margin < 0 ? 0 : rect.y - margin;
                int r = l + rect.width + margin > gray.cols ? gray.cols : l + rect.width + margin;
                int b = t + rect.height + margin > gray.rows ? gray.rows : t + rect.height + margin;
                // 加一些间隔以免字符不完整
                cv::Rect rec(l, t, r - l, b - t);
                candidates.push_back(rec);
            }
            // cv::rectangle(gray, rect, cv::Scalar(0, 0, 255), 1);
		}
        // cv::imwrite("D:/code/web/Ruminer/public/gray.png", gray);
	}
    return candidates;
}
