import _ from 'node_modules/lodash';
import { AppConstant } from './constants/app.constant';

export class Helper {

  public static isEmpty(s): boolean {
    if (s == null || _.isUndefined(s) || _.isEmpty(s)) {
      return true;
    } else {
      return false;
    }
  }

  public static isNull(s): boolean {
    if (s == null || _.isUndefined(s)) {
      return true;
    } else { return false; }
  }

  public static getUTCDateStr(dt: Date): string {
    if (dt === null) {
      return '';
    } else {
      return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
    }
  }

  public static getBlankProfilePicture(s): string {
    if (Helper.isNull(s)) {
      return AppConstant.ASSET.BLANK_PROFILE;
    } else { return s; }
  }
}
