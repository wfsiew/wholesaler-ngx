export class AppConstant {

  public static PAGE_SIZE = 20;
  public static MAX_SCAN = 100;
  public static TIMEOUT = 15000;

  public static TIME_DIFFERENCE = {
    TODAY: 0,
    TOMORROW: 1,
    DAYS: 2
  };

  // HTTP Headers
  public static HTTP_HEADER = {
    LINK: 'link',
    X_TOTAL_COUNT: 'x-total-count'
  };

  // ROLES
  public static ROLE = {
    VENDOR: 'ROLE_VENDOR',
    PURCHASER: 'ROLE_PURCHASING_STAFF'
  };

  public static ASSET = {
    BARCODE: 'assets/img/bar-code.png',
    BLANK_PROFILE: 'assets/img/blank-profile.png',
    CUBE: 'assets/img/cube.png'
  };

  public static VALIDATEFORM = {
    BARCODE: /^[0-9]{12,13}$/,
    PRICE: /^\d+(?:\.\d{0,2})$/,
    DATE: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    QTY: /\d/
  };

  public static REGPATTERN = {
    BARCODE: '^[0-9]{12,13}$',
    PRICE: '^\d+(?:\.\d{0,2})$'
  };
}
