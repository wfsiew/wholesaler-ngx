export class AppLocaleConstant {

  public static OK = 'ok';
  public static YES = 'yes';
  public static NO = 'no';
  public static CANCEL = 'cancel';
  public static BARCODE_EXIST_MSG = 'inventory.scanbarcode.barcode-exist.msg';
  public static FORM_UNSAVED_MSG = 'form-unsaved.msg';

  public static getErrorLocale(code) {
    return `error.${code}`;
  }
}
