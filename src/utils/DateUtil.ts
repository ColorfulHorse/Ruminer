export default class DateUtil {
  static tokenValid(expiresIn: number, createtime: number) {
    return Date.now() - createtime < expiresIn * 0.9
  }
}
