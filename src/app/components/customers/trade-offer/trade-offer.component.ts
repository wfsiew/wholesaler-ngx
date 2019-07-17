import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import { Sort, SORT_ORDER, Pager } from '../../../shared/models/general';
import * as _ from 'lodash';
import { Helper } from 'src/app/shared/helpers';

@Component({
  selector: 'app-trade-offer',
  templateUrl: './trade-offer.component.html',
  styleUrls: ['./trade-offer.component.css']
})
export class TradeOfferComponent implements OnInit {

  readonly isEmpty = Helper.isEmpty;

  promoForm: FormGroup;
  newPromoForm: FormGroup;
  inValidProductId = false;
  lsSelectedSort = [];
  lsPromo = [];
  selectedProduct = [];
  page = 1;
  pager = new Pager(1);
  lookupList: any = [];
  searchLookUpList = [];
  showDialog = false;
  lstradeOff = [];
  display = false;
  productId: null;
  isNewPromo = false;
  isValidInput = false;
  isNewOffer = false;
  lookUpIndex = null;
  inx = null;
  promoIndex = null;
  isShowFilter = false;
  tradeOfferIndex = null;
  newPrdImage = 'assets/img/cube.png';
  productLook = {id: '', indx: ''};
  text = '';
  SORT_FIELD = {
    NAME: 'name',
    QTY: 'total_qty'
  };

  routerList = [
    {
      icon: 'mdi mdi-tag',
      name: 'Trade Offers',
      route: 'trade-offer'
    },
    {
      icon: 'mdi mdi mdi-file-eye',
      name: 'Wish List',
      route: 'wish-lisht'
    },
    {
      icon: 'mdi mdi-history',
      name: 'Transaction History',
      route: 'tras-history'
    }
  ];

  SORT_OPTIONS = [
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.DESC,
      icon: 'mdi mdi-tag',
      name: 'New Trade Offers',
    },
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi-inbox-arrow-down',
      name: 'Latest Promotion',
    },
  ];

  readonly AppConstant = AppConstant;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private productService: InventoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm();
    this.createNewPromoForm();
    this.loadTradeOffer();
    this.lookUpProduct('');
  }

  createForm() {
    this.promoForm = this.fb.group({
      promotions: this.fb.array([
        this.fb.group({
          from_date: [null, [Validators.required, Validators.pattern(AppConstant.VALIDATEFORM.DATE)]],
          to_date: [null, [Validators.required, Validators.pattern(AppConstant.VALIDATEFORM.DATE)]],
          buy_qty: [0, [Validators.required, Validators.min(1), Validators.pattern(AppConstant.VALIDATEFORM.QTY)]],
          free_qty: [0, [Validators.required, Validators.min(1), Validators.pattern(AppConstant.VALIDATEFORM.QTY)]]
        })
      ])
    });
  }

  createNewPromoForm() {
    this.newPromoForm = this.fb.group({
      from_date: [null, [Validators.required, Validators.pattern(AppConstant.VALIDATEFORM.DATE)]],
      to_date: [null, [Validators.required, Validators.pattern(AppConstant.VALIDATEFORM.DATE)]],
      buy_qty: [0, [Validators.required, Validators.min(1), Validators.pattern(AppConstant.VALIDATEFORM.QTY)]],
      free_qty: [0, [Validators.required, Validators.min(1), Validators.pattern(AppConstant.VALIDATEFORM.QTY)]]
    });
  }

  addPromoToNewProduct() {
    // this.customerService.post_addCustomerTradeOfferPromotion
  }


  UpdateNewPromo(value, tradeOffer, idx, tradeOfferIndex) {
    const tradeOfferId = tradeOffer.id;
    this.promoIndex = idx;
    this.tradeOfferIndex = tradeOfferIndex;
    const promo = value.promotions[idx];
    const promoId = tradeOffer.promotions[idx].id;
    const customerId = this.route.snapshot.params.id;
    const postData = {
      from_date: promo.from_date,
      to_date: promo.to_date,
      buy_qty: promo.buy_qty,
      free_qty: promo.free_qty
    };
    this.customerService.put_updateCustomerTradeOfferPromotion(customerId, tradeOfferId, promoId, postData).subscribe((res) => {
      this.loadTradeOffer();
      this.promoIndex = null;
      this.tradeOfferIndex = null;
    });
  }

  edit( i, tradeOfferIndex) {
    let o = false;
    if (this.promoIndex === i && this.tradeOfferIndex === tradeOfferIndex) {
       o = true;
    } else {
      o = false;
    }
    return o;
  }

  editPromo(idx, tradeOfferIndex) {
    this.promoIndex = idx;
    this.tradeOfferIndex = tradeOfferIndex;
  }

  saveNewPromo(value, tradeOffer, idx) {
    const tradeOfferId = tradeOffer.id;
    const customerId = this.route.snapshot.params.id;
    this.isNewPromo = !this.isNewPromo;
    const postData = {
      from_date: value.from_date,
      to_date: value.to_date,
      buy_qty: value.buy_qty,
      free_qty: value.free_qty
    };
    this.customerService.post_addCustomerTradeOfferPromotion(customerId, tradeOfferId, postData).subscribe((res) => {
      this.loadTradeOffer();
    });
  }

  get promotions(): FormArray {
    return this.promoForm.get('promotions') as FormArray;
  }

  addNewPrice(tradeOffer) {
    const customerId = this.route.snapshot.params.id;
    const data = {
      product_id: this.productId,
      offered_price: tradeOffer
    };
    if (this.productId === null) {
      this.inValidProductId = true;
    } else {
      this.customerService.post_addCustomerTradeOffer(customerId, data).subscribe((res) => {
        this.selectedProduct.pop();
        this.inValidProductId = false;
        this.loadTradeOffer();
        this.isNewOffer = false;
        this.initNewProduct();
      });
    }
  }

  changePrice(price, tradeOffer, idx) {
    const customerId = this.route.snapshot.params.id;
    const tradeOfferId = tradeOffer.id;
    const data = {
      product_id: tradeOffer.id,
      offered_price: price
    };
    this.customerService.put_updateCustomerTradeOffer(customerId, tradeOfferId, data).subscribe((res) => {
      this.productId = null;
      this.loadTradeOffer();
      this.isNewPromo = false;
    });
  }

  lookUpProduct(terms) {
    const term = terms;
    const page = 1;
    const limit = 5;
    const sort = '';
    const category = '';
    this.productService.get_productList(term, page, limit, sort, category).subscribe((res) => {
      this.lookupList = res.body;
    });
  }

  loadTradeOffer() {
    const customerId = this.route.snapshot.params.id;
    this.customerService.get_customerTradeOfferList(customerId).subscribe((res: any) => {
      this.lstradeOff = res;
      console.log(res);
      this.patchFormArrayValue(res);
    },
      (err: any) => {
        console.log(err);
      });
  }

  patchFormArrayValue(data) {
    _.forEach(data, (ele) => {
      const entity: SubmitModel = Object.assign({}, ele);
      const promoArray = this.promoForm.get('promotions') as FormArray;
      this.lsPromo = ele.promotions;
      let counter = 0;
      entity.promotions.forEach(addPromo => {
        if (counter === 0) {
          promoArray.at(0).patchValue(addPromo);
        } else {
          promoArray.push(this.fb.group(addPromo));
        }
        counter++;
      });
      console.log(this.promoForm);
    });
  }

  deletePromo(trdOffer, promo, i) {
    this.isNewPromo = false;
    const cusId = this.route.snapshot.params.id;
    const trdId = trdOffer.id;
    const promoId = promo.id;
    this.customerService.delete_deleteCustomerTradeOfferPromotion(cusId, trdId, promoId).subscribe((res) => {
      this.loadTradeOffer();
    });
  }

  isSortSelected(o) {
    const i = _.findIndex(this.lsSelectedSort, (k) => {
      return k.fieldname === o.field && k.order === o.order;
    });
    return i >= 0 ? true : false;
  }

  nextTo(cRoute) {
    const cusId = this.route.snapshot.params.id;
    console.log(cRoute.route);
    this.router.navigate([`customer/${cRoute.route}/${cusId}`]);
  }


  getProductLookUp(data, i) {
    this.productId = data.id;
    this.lookUpIndex = i;
    if (this.selectedProduct.length === 0) {
      this.selectedProduct.push(data);
    } else {
      this.selectedProduct.pop();
      this.selectedProduct.push(data);
    }
  }

  openDialog(prdId, idx) {
    this.showDialog = !this.showDialog;
    this.productLook = {id: prdId, indx: idx};
    this.selectedProduct.pop();
  }

  confirmLookUpDialog() {
    this.showDialog = false;
    this.newPrdImage = this.selectedProduct[0].picture;
    this.inValidProductId = false;
  }

  selectList(i) {
    if (i === this.lookUpIndex) {
      return 'selected-list';
    } else {
      return;
    }
  }

  get ff(): string {
    const o = this.promoForm.controls;
    return o.promotions.value;
  }

  get f() {
   return this.promotions;
  }

  cancelLookUpDialog() {
    this.showDialog = false;
    this.productId = null;
  }

  deleteTradeOffer(offerId) {
    const cusId = this.route.snapshot.params.id;
    this.customerService.delete_tradeOffer(cusId, offerId).subscribe((res) => {
      console.log(res);
      this.loadTradeOffer();
    });
  }

  search(event) {
    const term = event.query;
    const page = 1;
    const limit = 5;
    const sort = '';
    const category = '';
    this.productService.get_productList(term, page, limit, sort, category).subscribe((res: any) => {
      this.searchLookUpList = res.body;
    });
    // this.searchLookUpList
  }

  onSelectSearchTerm(event) {
    this.selectedProduct.pop();
    this.lookUpProduct(event.name);
  }

  showNewPromo(idx) {
    this.isNewPromo = !this.isNewPromo;
    this.newPromoForm.patchValue({
      from_date: '',
      to_date: '',
      buy_qty: 1,
      free_qty: 1
    });
    this.inx = idx;
  }

  /** @see show the new promotion toggle  */
  showNewPromoIcon(i): boolean {
    return;
  }

  newOffer() {
    this.isNewOffer = !this.isNewOffer;
    this.initNewProduct();
  }

  initNewProduct() {
    this.newPrdImage = AppConstant.ASSET.CUBE;
    this.productId = null;
  }

  FilterList() {
    this.isShowFilter = !this.isShowFilter;
  }
  clear() {
    this.isShowFilter = !this.isShowFilter;
    this.loadTradeOffer();
  }

  onSort(o) {
    const i = _.findIndex(this.lsSelectedSort, (k) => {
      return k.fieldame === o.field;
    });
    if (i >= 0) {
      if (this.lsSelectedSort[i].order === o.order) {
        _.remove(this.lsSelectedSort, (k) => {
          return k.fieldname === o.field;
        });
      } else {
        this.lsSelectedSort[i].order = o.order;
      }
    }  else {
      this.lsSelectedSort.push(new Sort(o.field, o.order));
    }
    this.refresh();
  }

  refresh() {
    console.log(this.lsSelectedSort);
  }

  isValidQty(o) {
    let bl = this.AppConstant.VALIDATE_INPUT_BORDER.VALID;
    this.isValidInput = true;
    const fd = this.AppConstant.VALIDATEFORM.QTY.test(o);
    if (!fd) {
      this.isValidInput = false;
      bl = this.AppConstant.VALIDATE_INPUT_BORDER.INVALID;
    }
    return bl;
  }

  isValidPrice(o) {
    // let bl = this.AppConstant.VALIDATE_INPUT_BORDER.VALID;
    // this.isValidInput = true;
    let lb = false;
    const fd = this.AppConstant.VALIDATEFORM.PRICE.test(o.value);
    if (!fd) {
      lb = true;
      // this.isValidInput = false;
      // bl = this.AppConstant.VALIDATE_INPUT_BORDER.INVALID;
    }
    return lb;
  }

  notMandatoryValidPrice(o) {
    let bl = this.AppConstant.VALIDATE_INPUT_BORDER.VALID;
    this.isValidInput = true;
    const fd = this.AppConstant.VALIDATEFORM.PRICE.test(o);
    if (!fd && o.value != null) {
      this.isValidInput = false;
      bl = this.AppConstant.VALIDATE_INPUT_BORDER.INVALID;
    }
    return bl;
  }

  isValidDate(o) {
    this.isValidInput = true;
    let bl = this.AppConstant.VALIDATE_INPUT_BORDER.VALID;
    const fd = this.AppConstant.VALIDATEFORM.DATE.test(o);
    if (!fd) {
      this.isValidInput = false;
      bl = this.AppConstant.VALIDATE_INPUT_BORDER.INVALID;
    }
    return bl;
  }

  dateFromLess(idx) {
    let fDate = null;
    if (idx === 0) {
      fDate = new Date();
    } else if (idx === 1) {
      fDate = this.promoForm.value.promotions[0].to_date;
    } else {
      fDate = this.promoForm.value.promotions[idx].from_date;
    }
    return fDate;
  }

  dateToLess(idx) {
    let tDate = null;
    if (idx === 0) {
      tDate = this.promoForm.value.promotions[idx].from_date;
    } else {
      tDate = this.promoForm.value.promotions[idx].from_date;
    }
    return tDate;
  }

  dateNewFromLess(idx) {
    let fDate = null;
    const pr = this.lstradeOff[idx].promotions;
    if (pr.length > 0) {
      fDate = this.lstradeOff[idx].promotions[0].to_date;
    } else {
     fDate = new Date();
    }
    return fDate;
  }

  dateNewToLess() {
    let tDate = null;
    if (!Helper.isEmpty(this.promoForm.value.from_date)) {
      tDate = this.promoForm.value.from_date;
    } else {
      tDate = new Date();
    }
    return tDate;
  }


}

export class Promotions {
  id: number;
  buy_qty: string;
  free_qty: string;
  from_date: number;
  to_date: number;
}
export class SubmitModel {
  id: number;
  offered_price: string;
  picture: string;
  promotions: Promotions[];
  constructor() {
    this.promotions = [new Promotions()];
  }
}
