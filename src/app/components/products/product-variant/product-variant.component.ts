import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { Location } from '@angular/common';
import { Helper } from '../../../shared/helpers';
import { AppConstant } from '../../../shared/constants/app.constant';
import { InventoryService } from 'src/app/services/inventory.service';
import { MessageService as PMessageService } from 'primeng/api';

@Component({
  selector: 'app-product-variant',
  templateUrl: './product-variant.component.html',
  styleUrls: ['./product-variant.component.css']
})
export class ProductVariantComponent implements OnInit {

  product: any = {};
  variant: any = {};
  list_expired = [];
  list_expires = [];
  month = 1;
  total_expired = 0;
  total_expires = 0;
  id = 0;
  vid = 0;

  readonly AppConstant = AppConstant;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private pmessageService: PMessageService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.id = this.route.snapshot.params.id;
    this.vid = this.route.snapshot.params.vid;
    this.inventoryService.get_product(this.id).subscribe((res: any) => {
      this.product = res;
    },
    (err: any) => {
      this.handleError(err, 'LOAD');
    });

    this.loadProductVariant();
    this.loadExpired();
    this.loadExpires();
  }

  loadProductVariant() {
     this.inventoryService.get_productVariant(this.id, this.vid).subscribe((res: any) => {
      this.variant = res;
    },
    (err: any) => {
      this.handleError(err, 'LOAD PRODUCT VARIANT');
    });
  }

  loadExpired() {
    this.inventoryService.get_productBatchList(this.vid, '1', '').subscribe((res: any) => {
      this.list_expired = res;
      if (!Helper.isEmpty(res)) {
        let n = 0;
        _.forEach(res, (k) => {
          n += k.qty;
        });
        this.total_expired = n;
      } else {
        this.total_expired = 0;
      }
    },
    (err: any) => {
      this.handleError(err, 'LOAD EXPIRED');
    });
  }

  loadExpires() {
    this.inventoryService.get_productBatchList(this.vid, '', this.month).subscribe((res: any) => {
      this.list_expires = res;
      if (!Helper.isEmpty(res)) {
        let n = 0;
        _.forEach(res, (k) => {
          n += k.qty;
        });
        this.total_expires = n;
      } else {
        this.total_expires = 0;
      }
    },
    (err: any) => {
      this.handleError(err, 'LOAD EXPIRES IN');
    });
  }

  onBack() {
    this.location.back();
  }

  setMonth(x) {
    if (x === 0) {
      this.month = null;
    } else {
      this.month = x;
    }

    this.loadExpires();
  }

  handleError(err, sry) {
    this.pmessageService.add({ severity: 'error', summary: sry, detail: err });
  }
}

