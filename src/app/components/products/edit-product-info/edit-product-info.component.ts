import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { ImageSnippet, Quantity } from '../scan2dbarcode/models';
import { Location } from '@angular/common';
import { Helper } from 'src/app/shared/helpers';
import { Pager } from 'src/app/shared/models/general';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import { AppLocaleConstant } from '../../../shared/constants/app-locale.constant';
import { InventoryService } from 'src/app/services/inventory.service';
import { MessageService } from 'src/app/services/message.service';
import { ConfirmationService, MessageService as PMessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-product-info',
  templateUrl: './edit-product-info.component.html',
  styleUrls: ['./edit-product-info.component.css']
})
export class EditProductInfoComponent implements OnInit, OnDestroy {

  isEdit = false;
  isAdd = false;
  isEditVariant = false;
  addNewPromotion = false;

  mform: FormGroup;
  promoForm: FormGroup;
  promoFormArray: FormGroup;

  isSaved = false;
  display = false;
  subscription: Subscription;

  isProductNameReadOnly = true;
  iswsPriceReadOnly = true;
  isrretailPriceReadOnly = true;
  isRead = false;
  wsPrice = true;
  rretailPrice = true;

  id = 0;
  barcode = '';
  imageUrl = 'assets/img/cube.png';
  // promotion data
  from_date = null;
  to_date = null;
  buy_qty = null;
  free_qty = null;

  quantity: Quantity;
  productImage: ImageSnippet;
  image: ImageSnippet;
  category = 0;
  capacity = 0;
  selectedCapacity = 0;
  lsproductvar = [];
  lscategory = [];
  lscapacity = [];
  lslookup = [];
  lspromotion = [];
  lstradeoffer = [];

  mouseParLevelPlus = false;
  mouseParLevelMinus = false;

  tradeOffer = {
    pager: new Pager(1)
  };

  // productImg: ImageSnippet //= 'assets/img/cube.png';

  cls = null;

  readonly AppConstant = AppConstant;
  readonly isEmpty = Helper.isEmpty;
  readonly getBlankProfilePicture = Helper.getBlankProfilePicture;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private pmessageService: PMessageService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.createForm();
    this.load();

    /** @see if edit product */
    const id = this.route.snapshot.params.id;

    if (Helper.isNull(id)) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.loadProduct(id);
    }

    /** Scanned barcode  */
    if (!this.isEdit) {
      this.subscription = this.messageService.get().subscribe(x => {
        if (_.isEmpty(x)) {
          this.router.navigate(['products/scan2dbarcode']);
        } else if (x.name === 'scanbarcode') {
          const o = x.data;
          this.barcode = o.barcode;
          this.quantity = o.quantity;
          this.image = o.image;
          this.isAdd = true;
          this.lsproductvar.push({ id: 0, image: o.image, quantity: o.quantity });
        }
      });
    }

    this.createUpdatePromoForm();
    this.createAddPromoForm();
  }

  ngOnDestroy() {
    if (!this.isEdit) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.inventoryService.get_productCategoryList().subscribe((res: any) => {
      this.lscategory = res;
      if (!Helper.isEmpty(res)) {
        this.setCategory(res[0].id, null);
      }
    },
    (err: any) => {
      this.handleError(err, 'LOAD PRODUCT CATEGORY');
    });
  }

  onBack() {
    if (this.promoForm.touched || this.mform.touched) {
      this.translateService.get([
        AppLocaleConstant.YES,
        AppLocaleConstant.NO,
        AppLocaleConstant.FORM_UNSAVED_MSG
      ])
      .subscribe(res => {
        this.confirmationService.confirm({
          acceptLabel: res[AppLocaleConstant.YES],
          rejectLabel: res[AppLocaleConstant.NO],
          message: res[AppLocaleConstant.FORM_UNSAVED_MSG],
          accept: () => {
            this.router.navigate(['products']);
          },
          reject: () => {

          }
        });
      });
    } else {
      this.router.navigate(['products']);
    }
  }

  createForm() {
    this.mform = this.fb.group(
      {
        product_name: ['', [Validators.required]],
        description: [''],
        picture: [''],
        wholesaler_price: [null, [Validators.required, Validators.pattern(AppConstant.VALIDATEFORM.PRICE), Validators.min(0.01)]],
        recommended_retail_price: [null, [Validators.pattern(AppConstant.VALIDATEFORM.PRICE)]],
        not_for_sale: [false],
        par_level: [0, [Validators.required]],
        optimum_level: [0, [Validators.required]],
        stock_balance: [0]
      });
  }

  minusParLevelQty() {
    if (this.f.par_level.value > 1) {
      this.isTouched();
      this.mform.patchValue({ par_level: this.f.par_level.value - 1 });
    }
  }

  onMouseUpminusParLevelQty(event) {
    this.mouseParLevelMinus = false;
  }

  onMouseDownminusParLevelQty(event) {
    this.mouseParLevelMinus = true;
    this.changeParLevelDown();
  }

  onMouseUpaddParLevelQty(event) {
    this.mouseParLevelPlus = false;
  }

  onMouseDownaddParLevelQty(event) {
    this.mouseParLevelPlus = true;
    this.changeParLevelUp();
  }

  changeParLevelUp() {
    if (this.mouseParLevelPlus) {
      this.addParLevelQty();
      setTimeout(() => {
        this.changeParLevelUp();
      }, 100);
    }
  }

  changeParLevelDown() {
    if (this.mouseParLevelMinus) {
      this.minusParLevelQty();
      setTimeout(() => {
        this.changeParLevelDown();
      }, 100);
    }
  }

  addParLevelQty() {
    this.isTouched();
    if (this.f.optimum_level.value > this.f.par_level.value + 1) {
      this.mform.patchValue({ par_level: this.f.par_level.value + 1 });
    } else if (this.f.optimum_level.value === 0) {
      this.mform.patchValue({ par_level: this.f.par_level.value + 1 });
      this.mform.patchValue({ optimum_level: this.f.optimum_level.value + 2 });
    } else {
      this.mform.patchValue({ par_level: this.f.par_level.value + 1 });
      this.mform.patchValue({ optimum_level: this.f.optimum_level.value + 1 });
    }
  }

  minusOptimumQty() {
    this.isTouched();
    if (this.f.optimum_level.value > 1) {
      if (this.f.par_level.value + 1 === this.f.optimum_level.value) {
        this.mform.patchValue({ optimum_level: this.f.optimum_level.value - 1 });
        this.mform.patchValue({ par_level: this.f.par_level.value - 1 });
      } else {
        this.mform.patchValue({ optimum_level: this.f.optimum_level.value - 1 });
      }
    } else {
      this.mform.patchValue({ optimum_level: this.f.optimum_level.value - 1 });
    }
  }

  addOptimumQty() {
    this.isTouched();
    this.mform.patchValue({ optimum_level: this.f.optimum_level.value + 1 });
  }

  createAddPromoForm() {
    this.promoFormArray = this.fb.group(
      {
        promotions: this.fb.array([
          this.fb.group(
            {
              id: [null, [Validators.required]],
              from_date: [null, [Validators.required]],
              to_date: [null, [Validators.required]],
              buy_qty: [1, [Validators.required, Validators.min(1)]],
              free_qty: [1, [Validators.required, Validators.min(1)]]
            }
          )
        ])
      }
      // , { validator: this.validateForm }
    );
  }

  addNewPromoBuyQty() {
    this.promoForm.value.buy_qty += 1;
  }

  minusNewPromoBuyQty() {
    if (this.promoForm.value.buy_qty > 1) {
      this.promoForm.value.buy_qty -= 1;
    }
  }

  addNewPromoFreeQty() {
    this.promoForm.value.free_qty += 1;
  }

  minusNewPromoFreeQty() {
    if (this.promoForm.value.free_qty > 1) {
      this.promoForm.value.free_qty -= 1;
    }
  }

  addNewPromo() {
    this.addNewPromotion = true;
    this.isTouched();
    this.promoForm.patchValue({
      id: 0,
      from_date: null,
      to_date: null,
      buy_qty: 0,
      free_qty: 0
    });
  }

  get promotions(): FormArray {
    return this.promoFormArray.get('promotions') as FormArray;
  }

  createUpdatePromoForm() {
    this.promoForm = this.fb.group(
      {
        id: [0],
        from_date: [null, [Validators.required]],
        to_date: [null, [Validators.required]],
        buy_qty: [1, [Validators.required, Validators.min(1)]],
        free_qty: [1, [Validators.required, Validators.min(1)]]
      }
    );
  }

  addUpdateBuyPromo(idx) {
    this.promoFormArray.value.promotions[idx].buy_qty += 1;
    this.isTouched();
  }

  minusUpdateBuyPromo(idx) {
    if (this.promoFormArray.value.promotions[idx].buy_qty > 1) {
      this.promoFormArray.value.promotions[idx].buy_qty -= 1;
      this.isTouched();
    }
  }

  addUpdateFreePromo(idx) {
    const free = this.promoFormArray.value.promotions[idx].free_qty;
    const buy = this.promoFormArray.value.promotions[idx].buy_qty;

    if (free < buy) {
      this.promoFormArray.value.promotions[idx].free_qty += 1;
      this.isTouched();
    }
  }

  minusUpdateFreePromo(idx) {
    if (this.promoFormArray.value.promotions[idx].free_qty > 1) {
      this.promoFormArray.value.promotions[idx].free_qty -= 1;
      this.isTouched();
    }
  }

  /** @see List promotions */
  /* loadPromotion() {
    let id = this.route.snapshot.params.id;
    this.inventoryService.get_productPromotionList(id).subscribe((res: any) => {
      this.lspromotion = res;
      let fm: FormArray = <FormArray>this.promoFormArray.get('promotions');
      let counter = 0;

      _.forEach(res, (k) => {
        if (counter == 0) {
          fm.at(0).patchValue(k);
        }

        else {
          fm.push(this.fb.group(k));
        }

        ++counter;
      });
    });
  }
 */
  onSavePromo() {
    if (this.promoForm.invalid) {
      this.display = true;
    } else {
      const promoData = this.promoForm.value;
      this.addNewPromotion = false;
      const fm = <FormArray>this.promoFormArray.get('promotions');
      fm.push(this.fb.group(promoData));
      // const id = this.route.snapshot.params.id;
      // this.inventoryService.post_addPromotion(id, promoData).subscribe((res: any) => {
      //   this.loadProductPromotion();
      //   this.resetPromoForm();
      //   this.display = false;
      // },
      // (err: any) => {
      //   this.handleError(err, 'SAVE PROMO');
      // });
    }
  }

  // enableEdit(idx, clsName): string {
  //   if (idx == this.cls && this.isSaved) {
  //     return 'pi pi-save';
  //   }

  //   else {
  //     this.isSaved = true;
  //     return 'pi pi-pencil';
  //   }
  // }

  // isPromoEdit(i) {
  //   const id = this.promoFormArray.value.promotions[i].id;
  //   let x = _.findIndex(this.lseditpromo, (k) => {
  //     return k == id;
  //   });
  //   return x >= 0 ? true : false;
  // }

  // editPromotion(i) {
  //   this.addNewPromotion = false;

  //   if (this.isPromoEdit(i)) {
  //     this.updatePromotion(i);
  //     return;
  //   }

  //   const id = this.promoFormArray.value.promotions[i].id;
  //   this.lseditpromo.push(id);
  // }

  // cancelEditPromotion(i) {
  //   const id = this.promoFormArray.value.promotions[i].id;
  //   let x = _.remove(this.lseditpromo, (k) => {
  //     return k == id;
  //   });
  // }

  deletePromotion(i) {
    // if (this.isPromoEdit(i)) {
    //   this.cancelEditPromotion(i);
    //   return;
    // }

    const fm = this.promoFormArray.get('promotions') as FormArray;
    fm.removeAt(i);
    this.isTouched();

    // const id = this.route.snapshot.params.id;
    // const promo = this.promoFormArray.value.promotions[i];
    // this.inventoryService.delete_promotion(id, promo.id).subscribe((res: any) => {
    //   this.loadProductPromotion();
    // },
    // (err: any) => {
    //   this.handleError(err, 'DELETE PROMOTION');
    // });
  }

  // editPromotion__(idx) {
  //   this.isSaved = !this.isSaved;
  //   this.addNewPromotion = false;
  //   this.cls = idx;
  //   if (!this.isSaved) {
  //     this.updatePromotion(idx);
  //   }
  // }

  // updatePromotion(i) {
  //   this.addNewPromotion = false;
  //   this.cancelEditPromotion(i);
  //   // const promoData = this.promoFormArray.value.promotions[i];
  //   // const id = this.route.snapshot.params.id;
  //   // this.inventoryService.post_updatePromotion(id, promoData.id, promoData).subscribe((res: any) => {
  //   //   this.addNewPromotion = false;
  //   //   this.cancelEditPromotion(i);
  //   // });
  // }

  /** UPLOAD FILE */

  uploadFile(event) {
    const file: File = event.item(0);
    const rd = new FileReader();
    rd.addEventListener('load', (evet: any) => {
      this.productImage = new ImageSnippet(evet.target.result, file);
      this.imageUrl = evet.target.result;
    });
    rd.readAsDataURL(file);
    this.isTouched();
  }

  resetEdit() {
    this.id = 0;
    this.isAdd = true;
    this.setFormControls();
    this.lsproductvar = [{ id: 0, image: this.image, quantity: this.quantity }];
  }

  setFormControls() {
    if (!this.isAdd && !this.isEdit) {
      this.isRead = true;
    } else {
      this.isRead = false;
    }
  }

  /** @see Look-up */
  searchProduct(event) {
    this.resetEdit();
    if (Helper.isEmpty(this.f.product_name.value)) return;
    this.inventoryService.get_productLookup(this.f.product_name.value).subscribe((res: any) => {
      this.lslookup = res;
    });
  }

  onSelectProduct(value) {
    this.loadProduct(value.id);
  }

  loadProduct(id) {
    this.inventoryService.get_product(id).subscribe((res: any) => {
      this.setProduct(res);
    },
    (err: any) => {
      this.handleError(err, 'LOAD PRODUCT');
    });
  }

  setProduct(o) {
    if (this.isEdit) {
      this.mform.patchValue(
        {
          product_name: o.name,
          description: o.description,
          par_level: o.par_level,
          optimum_level: o.optimum_level,
          wholesaler_price: o.wholesaler_price,
          recommended_retail_price: o.recommended_retail_price,
          not_for_sale: o.not_for_sale,
          stock_balance: o.stock_balance
        }
      );
      this.id = o.id;
      this.category = o.product_category.id;
      this.image = o.picture;

      if (!Helper.isEmpty(o.picture)) {
        this.productImage = new ImageSnippet(o.picture, null);
        this.imageUrl = o.picture;
        this.mform.patchValue({ picture: o.picture });
      }

      this.loadProductCapacity(o.product_capacity.id);
      this.loadProductVariant();
      this.loadProductPromotion(o.promotions);
      this.loadProductTradeOffer();
    } else {
      this.isAdd = false;
      this.mform.patchValue(
        {
          description: o.description,
          par_level: o.par_level,
          optimum_level: o.optimum_level,
          wholesaler_price: o.wholesaler_price,
          recommended_retail_price: o.recommended_retail_price,
          not_for_sale: o.not_for_sale,
          stock_balance: o.stock_balance
        }
      );
      this.id = o.id;
      this.category = o.product_category.id;
      this.image = new ImageSnippet(o.picture, this.image.file);

      if (!Helper.isEmpty(o.picture)) {
        this.productImage = new ImageSnippet(o.picture, null);
        this.imageUrl = o.picture;
        this.mform.patchValue({ picture: o.picture });
      }

      this.setFormControls();
      this.loadProductCapacity(o.product_capacity.id);

      const lx = [];
      if (!Helper.isEmpty(this.lsproductvar)) {
        if (this.lsproductvar[0].id == 0) {
          lx.push(this.lsproductvar[0]);
        }
      }

      this.inventoryService.get_productVariantList(this.id).subscribe((res: any) => {
        const ls = res;
        _.forEach(ls, (k) => {
          lx.push({
            id: k.id,
            image: new ImageSnippet(k.picture, null), 
            quantity: { id: 0, qty: k.qty }
          });
        });
        this.lsproductvar = lx;
      },
      (err: any) => {
        this.handleError(err, 'LOAD PRODUCT VARIANTS');
      });
    }
  }

  setNotForSale() {
    this.mform.patchValue({ not_for_sale: !this.f.not_for_sale.value });
    this.isTouched();
  }

  setCategory(i, ev) {
    this.category = i;
    this.loadProductCapacity(null);
    if (ev != null) {
      this.isTouched();
    }
  }

  loadProductCapacity(capacity) {
    this.inventoryService.get_productCapacityList(this.category).subscribe((res: any) => {
      this.lscapacity = res;
      if (capacity == null && !Helper.isEmpty(res)) {
        this.capacity = res[0].id;
      } else {
        this.capacity = capacity;
      }
    },
    (err: any) => {
      this.handleError(err, 'LOAD PRODUCT CAPACITY');
    });
  }

  setCapacity(i) {
    this.capacity = i;
  }

  loadProductVariant() {
    const lx = [];
    this.inventoryService.get_productVariantList(this.id).subscribe((res: any) => {
      const ls = res;
      _.forEach(ls, (k) => {
        lx.push({
          id: k.id,
          image: new ImageSnippet(k.picture, null), 
          quantity: { id: 0, qty: k.qty }
        });
      });
      this.lsproductvar = lx;
    },
    (err: any) => {
      this.handleError(err, 'LOAD PRODUCT VARIANTS');
    });
  }

  loadProductVariantByID(id) {
    if (id === 0) { return; }
    this.router.navigate(['products/variant', this.id, id]);
  }

  loadProductPromotion(ls) {
    this.lspromotion = ls;
    this.createAddPromoForm();
    const fm = this.promoFormArray.get('promotions') as FormArray;
    let counter = 0;

    _.forEach(ls, (k) => {
      if (counter === 0) {
        fm.at(0).patchValue(k);
      } else {
        fm.push(this.fb.group(k));
      }
      ++counter;
    });

    // this.inventoryService.get_productPromotionList(this.id).subscribe((res: any) => {
    //   this.lspromotion = res;
    //   this.createAddPromoForm();
    //   let fm = this.promoFormArray.get('promotions') as FormArray;
    //   let counter = 0;

    //   _.forEach(res, (k) => {
    //     if (counter == 0) {
    //       fm.at(0).patchValue(k);
    //     }

    //     else {
    //       fm.push(this.fb.group(k));
    //     }

    //     ++counter;
    //   });
    // },
    // (err: any) => {
    //   this.handleError(err, 'LOAD PRODUCT PROMOTIONS');
    // });
  }

  loadProductTradeOffer() {
    this.inventoryService.get_productTradeOfferList(this.id, this.tradeOffer.pager.page, AppConstant.PAGE_SIZE).subscribe((res: any) => {
      this.tradeOffer.pager.setFromHeaders(res.headers);
      this.lstradeoffer = res.body;
    },
    (err: any) => {
      this.handleError(err, 'LOAD TRADE OFFER');
    });
  }

  onTradeOfferPageChange(event) {
    this.tradeOffer.pager.page = event.page + 1;
    this.loadProductTradeOffer();
  }

  /* checkBarcode() {
    this.inventoryService.get_checkBarcodeExist('wsdes', this.scannedSummaryID).subscribe((res) => {
    },
    (err) => {
      this.handleError(err, 'CHECK BARCODE')
    });
  } */

  /* getProduct(id) {
    this.inventoryService.get_product(id).subscribe((res: any) => {
      if (this.isEdit) {
        this.reloadData(res);
        this.loadProductVariant();
        this.loadPromotion();
        this.getTradeOffersList();
        this.image = res.picture;
      }
    },
    (err) => {
      this.handleError(err, 'GET PRODUCT');
    });
  } */

  /* loadProductVariant() {
    let id = this.route.snapshot.params.id;
    this.inventoryService.get_productVariantList(id).subscribe((res: any) => {
      this.lsproductvar = res;
    })
  } */

  get f() {
    return this.mform.controls;
  }

  get invalidData() {
    const b = this.mform.invalid || this.mform.untouched;
    if (!this.isEdit) {
      return b || Helper.isEmpty(this.productImage) || Helper.isEmpty(this.image) || Helper.isEmpty(this.barcode) ||
        this.category === 0 || Helper.isNull(this.category) ||
        this.capacity === 0 || Helper.isNull(this.capacity);
    }

    return b || Helper.isEmpty(this.productImage) ||
      this.category === 0 || Helper.isNull(this.category) ||
      this.capacity === 0 || Helper.isNull(this.capacity);
  }

  resetPromoForm() {
    this.promoFormArray.reset();
    // this.promoFormArray.markAsTouched()
  }

  onSubmitAddSuccess() {
    this.messageService.send('add-product', { barcode: this.barcode });
    this.onSubmitSuccess();
  }

  onSubmitUpdateSuccess() {
    this.onSubmitSuccess();
  }

  onSubmitAdd() {
    const o = {
      scanned_summary: {
        id: this.isEdit ? 0 : this.scannedSummaryID
      },
      name: this.f.product_name.value,
      description: this.f.description.value,
      wholesaler_price: this.f.wholesaler_price.value,
      recommended_retail_price: this.f.recommended_retail_price.value,
      not_for_sale: this.f.not_for_sale.value,
      commission: 0,
      par_level: this.f.par_level.value,
      optimum_level: this.f.optimum_level.value,
      product_category: {
        id: this.category
      },
      product_capacity: {
        id: this.capacity
      },
      product_variations: [
        {
          barcode: this.barcode,
          qty: this.quantity.id
        }
      ]
    };

    const fm = new FormData();
    fm.append('data', JSON.stringify(o));

    if (!Helper.isNull(this.productImage) && !Helper.isNull(this.productImage.file)) {
      fm.append('picture', this.productImage.file, this.productImage.file.name);
      fm.append('pictures', this.productImage.file, this.productImage.file.name);
    }

    fm.append('product_variation_pictures', this.image.file, this.image.file.name);

    this.inventoryService.post_addProduct(fm).subscribe((res: any) => {
      this.onSubmitAddSuccess();
    },
    (err: any) => {
      this.handleError(err, 'SAVE');
    });
  }

  onSubmitAddIntoExisting() {
    const o = {
      id: this.id,
      scanned_summary: {
        id: this.isEdit ? 0 : this.scannedSummaryID
      },
      name: this.f.product_name.value,
      description: this.f.description.value,
      wholesaler_price: this.f.wholesaler_price.value,
      recommended_retail_price: this.f.recommended_retail_price.value,
      not_for_sale: this.f.not_for_sale.value,
      commission: 0,
      par_level: this.f.par_level.value,
      optimum_level: this.f.optimum_level.value,
      product_category: {
        id: this.category
      },
      product_capacity: {
        id: this.capacity
      },
      product_variations: [
        {
          barcode: this.barcode,
          qty: this.quantity.id
        }
      ]
    };

    const fm = new FormData();
    fm.append('data', JSON.stringify(o));

    fm.append('product_variation_pictures', this.image.file, this.image.file.name);
    this.inventoryService.put_addProduct(fm).subscribe((res: any) => {
      this.onSubmitAddSuccess();
    },
    (err: any) => {
      this.handleError(err, 'SAVE');
    });
  }

  onSubmitUpdate() {
    const id = this.route.snapshot.params.id;
    const o = {
      name: this.f.product_name.value,
      description: this.f.description.value,
      wholesaler_price: this.f.wholesaler_price.value,
      recommended_retail_price: this.f.recommended_retail_price.value,
      not_for_sale: this.f.not_for_sale.value,
      commission: 0,
      par_level: this.f.par_level.value,
      optimum_level: this.f.optimum_level.value,
      product_category: {
        id: this.category
      },
      product_capacity: {
        id: this.capacity
      }
    };

    const lpromo = [];

    for (let i = 0; i < this.promotions.length; i++) {
      const x = this.promoFormArray.value.promotions[i];
      if (Helper.isNull(x.id) || Helper.isNull(x.from_date) || Helper.isNull(x.to_date)) continue;
      lpromo.push({
        id: x.id,
        from_date: x.from_date,
        to_date: x.to_date,
        buy_qty: x.buy_qty,
        free_qty: x.free_qty
      });
    }

    if (this.addNewPromotion) {
      const f = this.promoForm;
      lpromo.push({
        id: 0,
        from_date: f.value.from_date,
        to_date: f.value.to_date,
        buy_qty: f.value.buy_qty,
        free_qty: f.value.free_qty
      });
    }

    o['promotions'] = lpromo;

    const fm = new FormData();
    fm.append('data', JSON.stringify(o));

    if (!Helper.isNull(this.productImage) && !Helper.isNull(this.productImage.file)) {
      fm.append('picture', this.productImage.file, this.productImage.file.name);
      fm.append('pictures', this.productImage.file, this.productImage.file.name);
    }

    this.inventoryService.put_updateProduct(fm, id).subscribe((res: any) => {
      this.onSubmitUpdateSuccess();
    },
    (err: any) => {
      this.handleError(err, 'SAVE');
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.onSubmitUpdate();
    } else {
      if (this.isAdd) {
        this.onSubmitAdd();
      } else {
        this.onSubmitAddIntoExisting();
      }
    }
  }

  get isValidPromoForm() {
    let b = false;
    if (this.promoForm.invalid || this.promoFormArray.invalid) {
      b = false;
     } else {
       b = true;
     }
    return b;
  }

  get isValidForm() {
    let bl = 'success';
    if (this.promoForm.invalid && this.promoForm.touched) {
      bl = 'invalid-promo';
    } else {
      bl = 'success';
    }
    return bl;
  }

  get isValidFormArray() {
    let bl = 'success';
    if (this.promoFormArray.invalid && this.promoFormArray.touched) {
      console.log(this.promoFormArray.controls);
      bl = 'invalid-promo';
    } else {
      bl = 'success';
    }
    return bl;
  }

  validateForm(control: AbstractControl): { [key: string]: boolean } {
    const promotion = control.get('promotions');
    console.log(promotion);
    // if (promo.length > 0) {
    //   _.forEach(promo, (k) => {
    //     if (k) {
    //       console.log(k);
    //     }
    //   });
    // } else {
    //   pr = true;
    // }

    // if (pr) {
    //   return null;
    // }
    return { mismatch: false };
  }


  onSubmitSuccess() {
    if (!this.isEdit) {
      this.location.back();
    } else {
      this.router.navigate(['products']);
    }
  }

  onCancel() {
    if (!this.isEdit) {
      this.messageService.send('add-product-cancel', { barcode: this.barcode });
      this.location.back();
    } else {
      this.router.navigate(['products']);
    }
  }

  get scannedSummaryID() {
    const s = localStorage.getItem('scanned_summary_id');
    const n = parseInt(s);
    return n;
  }

  isValidAmount(x) {
    if (Helper.isEmpty(x)) { return true; }
    const r = AppConstant.VALIDATEFORM.PRICE.test(x);
    return r;
  }

  isTouched() {
    this.mform.markAsTouched();
  }

  handleError(err, sumary) {
    this.pmessageService.add({ severity: 'error', summary: sumary, detail: err });
  }
}

export class Promotions {
  promotions: Promotion[];
  constructor() {
    this.promotions = [new Promotion()];
  }
}

export class Promotion {
  id: number;
  from_date: string;
  to_date: string;
  buy_qty: number;
  free_tqy: number
}