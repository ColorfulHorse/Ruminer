#include <baseapi.h>
#include <allheaders.h>
#include <string>

using namespace std;
using namespace tesseract;

TessBaseAPI *api = nullptr;
string dataPath = nullptr;

void init(string path);

int loadLanguage(string lang);

string recognize(string base64);

void destroy();