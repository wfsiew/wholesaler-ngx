export class AppConstant {

  public static PAGE_SIZE = 18;
  public static MAX_SCAN = 100;
  public static TIMEOUT = 15000;
  public static MAX_PROMO = 2;

  public static TIME_DIFFERENCE = {
    TODAY: 0,
    TOMORROW: 1,
    DAYS: 2
  };

  public static VALIDATE_INPUT_BORDER = {
    VALID: 'success',
    INVALID: 'invalid-promo'
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
    PRICE: /^\d+(?:\.\d{0,2})?$/,
    DATE: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
    QTY: /^[1-9]/,
    EMAIL: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/, // done
    COMPANY_NAME: /^(?!([Sdn.]+[ ]))+(?!([Bhd]+[ ]))+(?!([Berhad]+[ ]))+(?!([Sendirian]+[ ]))+[a-zA-Z, & ]+(([', .-][a-zA-Z])?[a-zA-Z]\w*)*$/, // not confirm yet 
    CONTACT_PERSON: /^[a-zA-Z]+(([', .-][a-zA-Z ])?[a-zA-Z]*)*$/, // not confirm yet
    PHONE_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done
    OFFICE_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done
    BUSINESS_REGI_NO: /^([A-Z]{2}\d{7}-[A-Z])|(\d{6,}-[A-Z])|(LLP\d{7}-[A-Z]{3})$/, // done
    TAX_NO: /^[A-Z]{3}-\d{4}-\d{6}/, // 8 temp 3
    FAX_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done 
    ADDRESS_LINE1: /[A-Za-z0-9\-\\,.]+/, // done
    ADDRESS_LINE2: /[A-Za-z0-9\-\\,.]+/, // done  255
    ADDRESS_LINE3: /[A-Za-z0-9\-\\,.]+/, // done  255
    POST_CODE: /^\d{5}$/, // done 
    BANK: /(^\d{5,17}$)/, // not yet
    ACCOUNT_NO: /^\d{5,17}$/, // done,
    PASSWORD_VALIDATION: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  };

  // price

  public static REGPATTERN = {
    BARCODE: '^[0-9]{12,13}$',
    PRICE: '^\d+(?:\.\d{0,2})$'
  };
}
