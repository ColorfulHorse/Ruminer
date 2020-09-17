#include "include/lib.h"

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

// 获取系统安装字体
vector<string> getSystemFonts() {
    // 初始化Gdiplus
		Gdiplus::GdiplusStartupInput m_gdiplusStartupInput;
    ULONG_PTR m_gdiplusToken;
    Gdiplus::GdiplusStartup(&m_gdiplusToken, &m_gdiplusStartupInput, NULL);
		vector<string> fonts;
		{
			Gdiplus::InstalledFontCollection installedFondColl;
			int count = installedFondColl.GetFamilyCount();
			Gdiplus::FontFamily array[500];
			installedFondColl.GetFamilies(count, array, &count);
			for (int i = 0; i < count; i++) {
			WCHAR* name = new WCHAR[32];
			array[i].GetFamilyName(name);
			fonts.push_back(WCharToMByte(name));
			delete[] name;
			}
		}
		// 销毁之前要先销毁所有Gdiplus对象
		Gdiplus::GdiplusShutdown(m_gdiplusToken);
    return fonts;
}

