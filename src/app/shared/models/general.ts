import { Helper } from '../helpers';
import { AppConstant } from '../constants/app.constant';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
};

export class Sort {

  fieldname: string;
  order: string;

  constructor(fname, order) {
    this.fieldname = fname;
    this.order = order;
  }

  toString() {
    if (Helper.isEmpty(this.fieldname)) { return ''; }
    return `${this.fieldname}:${this.order}`;
  }

  toggle() {
    if (this.order === SORT_ORDER.ASC) {
      this.order = SORT_ORDER.DESC;
    } else {
      this.order = SORT_ORDER.ASC;
    }
  }
}

export class Pager {
  page: number = 1;
  total_records: number = 0;
  total_pages: number = 1;

  constructor(page) {
    this.page = page;
    this.total_records = 0;
    this.total_pages = 1;
  }

  setFromHeaders(headers) {
    this.total_records = headers.get('x-total-count');
    this.total_pages = headers.get('x-total-pages');
  }

  get currentPage() {
    return (this.page - 1) * AppConstant.PAGE_SIZE;
  }
}
