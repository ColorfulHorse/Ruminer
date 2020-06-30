const AipOcrClient = require('baidu-aip-sdk').ocr
const HttpClient = require('baidu-aip-sdk').HttpClient
import { BaiduApi } from '../constant/Constants'

export class OcrClient {
  private static client: any
  static getInstance() {
    if (this.client == null) {
      this.client = new AipOcrClient(BaiduApi.APP_ID, BaiduApi.API_KEY, BaiduApi.SECRET_KEY)
      HttpClient.setRequestOptions({timeout: 5000});
        HttpClient.setRequestInterceptor((requestOptions: any) => {

            return requestOptions;
        });
    }
  }
}
