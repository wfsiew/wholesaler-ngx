import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/shared/helpers';
import { Location } from '@angular/common';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  frm: FormGroup;
  @ViewChild(CustomerDetailsComponent) child;
  countries = [];
  states = [];
  countryId = 1;
  stateId = 1;
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
      company_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      fax: [''],
      email: ['', [Validators.required]],
      addr_1: ['', [Validators.required]],
      addr_2: [''],
      postcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }
  setCustomerProfile() {
    const id = this.route.snapshot.params.id;
    this.customerService.get_customer(id).subscribe((res: any) => {
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
      this.stateList(this.frm.value.country);
    });
  }

  setCountry(country) {
    const countryId = country.value.id;
    this.stateList(countryId);
    this.countryId = countryId;
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
