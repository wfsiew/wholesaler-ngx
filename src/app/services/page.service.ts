import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class PageService {

  constructor() { }
  
  inv_page = 1;
  inv_term = '';
  least_stock_balance = '';
  top_stock_balance = '';
  product_name_az = ''
  product_name_za = ''
  inv_sort = 0;

  inventory(page, sort) {
    this.inv_page = page;
    this.inv_sort = sort;
  }
  // initInventory(){
  //   this.inv_page = 1;
  //   this.inv_term = '';
  //   this.least_stock_balance = '';
  //   this.top_stock_balance = '';
  //   this.product_name_az = '';
  //   this.product_name_za = '';
  //   this.inv_sort = 0;
  // }
}
