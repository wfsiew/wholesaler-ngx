import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { Quantity, ImageSnippet } from '../scan2dbarcode/models';
import { InventoryService } from 'src/app/services/inventory.service';
import { Helper } from 'src/app/shared/helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.css']
})

export class VariantsComponent implements OnInit {
  prdId = null;
  variantsList = []
  product_image:string = 'assets/img/cube.png';
  variant_image:string = 'assets/img/cube.png';
  product:any = '';
  constructor(
    private messageService: MessageService,
    private location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit() {

    this.prdId = this.route.snapshot.params.id;
    this.getProduct(this.prdId);
    this.getProductVariant(this.prdId)
  }

  getProduct(id){
    this.inventoryService.get_product(id).subscribe((res:any)=>{
      this.product = res;
      if (res.picture !=null || res.picture !=undefined) {
        this.product_image = res.picture;
      }
    })
  }
  getProductVariant(prdId) {
    this.inventoryService.get_productVariantList(prdId).subscribe((res:any) => {
      this.variantsList = res;
    })
  }


  handleError(err, code) {
    console.log(err, code);
  }

  back() {
    this.location.back();
  }

}

