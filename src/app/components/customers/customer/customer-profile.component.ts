import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/shared/helpers';
import { Location } from '@angular/common';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import * as _ from 'lodash';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import { CustomerInputLength } from '../customer-constants';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  frm: FormGroup;
  readonly appConstant = AppConstant;
  readonly inputLength = CustomerInputLength;

  @ViewChild(CustomerDetailsComponent) child;
  countries = [];
  states = [];
  countryId = null;
  stateId = null;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.createForm();
    this.setCustomerProfile();
    this.loadCountryList();
  }
  createForm() {
    this.frm = this.fb.group({
      id: ['', [Validators.required]],
      company_name: ['',
      [Validators.required,
        Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.COMPANY_NAME)]],

      phone: ['',
      [Validators.pattern(this.appConstant.VALIDATEFORM.PHONE_NO),
        Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.PHONE)]],

      fax: ['', [Validators.pattern(this.appConstant.VALIDATEFORM.FAX_NO),
        Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.FAX)]],

      email: ['',
      [Validators.required,
        Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.EMAIL)]],

      addr_1: ['',
      [Validators.required,
        Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.ADDR_1),
        Validators.pattern(this.appConstant.VALIDATEFORM.ADDRESS_LINE1)]],

      addr_2: ['', [Validators.pattern(this.appConstant.VALIDATEFORM.ADDRESS_LINE2)]],

      postcode: ['', [Validators.required, Validators.pattern(this.appConstant.VALIDATEFORM.POST_CODE)]],

      city: ['', [Validators.required, Validators.maxLength(this.inputLength.LENGTH_VALIDATIONS.CITY)]],

      state: ['', [Validators.required]],

      country: ['', [Validators.required]],
    });
  }
  setCustomerProfile() {
    const id = this.route.snapshot.params.id;
    this.customerService.get_customer(id).subscribe((res: any) => {
      this.setCountry(res.address.country);
      this.stateId = res.address.state;
      this.frm.patchValue(
        {
          id: res.id,
          company_name: res.company_name,
          phone: res.phone,
          fax: res.fax,
          email: res.email,
          addr_1: res.address.addr_1,
          addr_2: res.address.addr_2,
          postcode: res.address.postcode,
          city: res.address.city,
          state: this.stateId,
          country: this.countryId
        }
      );
    });
  }

  updateProfile() {
    const body = {
      id: this.frm.value.id,
      company_name: this.frm.value.company_name,
      phone: this.frm.value.phone,
      fax: this.frm.value.fax,
      email: this.frm.value.email,
      address: {
        addr_1: this.frm.value.addr_1,
        addr_2: this.frm.value.addr_2,
        postcode: this.frm.value.postcode,
        city: this.frm.value.city,
        state: this.stateId,
        country: this.countryId
      }
    };
    const id = this.route.snapshot.params.id;
    if (Helper.isNull(id)) {
      this.location.back();
    } else {
      console.log(body);
      this.customerService.put_updateCustomer(id, body).subscribe((res) => {
        this.router.navigate([`customer/trade-offer/${id}`]);
      });
    }
  }

  loadCountryList() {
    this.customerService.get_countryList().subscribe((res: any) => {
      this.countries = res;
    });
  }

  setCountry(id) {
    this.countryId = id;
    this.stateList(id);
  }

  stateList(countryId) {
    this.customerService.get_stateList(countryId).subscribe((res: any) => {
      this.states = res;
    });
  }

  setState(state) {
    const stateId = state.value.id;
    this.stateId = stateId;
  }

  cancel() {
    this.location.back();
  }
}
