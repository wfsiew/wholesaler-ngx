import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import { Sort, SORT_ORDER, Pager } from '../../../shared/models/general';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  lsSelectedCategory = [];
  isShowFilter = false;
  lsSelectedSort = [];
  SORT_FIELD = {
    NAME: 'name',
    QTY: 'total_qty'
  };
  wishList = [];
  routerList = [
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.DESC,
      icon: 'mdi mdi-tag',
      name: 'Trade Offers',
      route: 'trade-offer'
    },
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi mdi-file-eye',
      name: 'Wish List',
      route: 'wish-lisht'
    },
    {
      field: this.SORT_FIELD.NAME,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi-history',
      name: 'Transaction History',
      route: 'tras-history'
    }
  ];

  SORT_OPTIONS = [
    {
      field: this.SORT_FIELD.NAME,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi-inbox-arrow-down',
      name: 'Latest Order'
    },
    {
      field: this.SORT_FIELD.NAME,
      order: SORT_ORDER.DESC,
      icon: 'mdi mdi-truck-delivery',
      name: 'Latest Delivery Order'
    }
  ];
  cusId = [];
  sortFields = [
    {id: 0, name: 'New'},
    {id: 1, name: 'Delivering'},
    {id: 2, name: 'Delivered'},
    {id: 3, name: 'Completed'}
  ];


  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.cusId = this.route.snapshot.params.id;
    this.loadWishList();
  }

  loadWishList() {
    this.customerService.get_customerWatchList(this.cusId).subscribe((res: any) => {
      this.wishList = res;
    });
  }

  isCategorySelected(id) {
    const i = _.indexOf(this.lsSelectedCategory, id);
    return i >= 0 ? true : false;
  }

  setCategory(id) {
    const i = _.indexOf(this.lsSelectedCategory, id);
    if (i < 0) {
      this.lsSelectedCategory.push(id);
    } else {
      const lx = _.remove(this.lsSelectedCategory, (k) => {
        return k === id;
      });
    }
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
  FilterList() {
    this.isShowFilter = !this.isShowFilter;
  }

  onSort(o) {
    const i = _.findIndex(this.lsSelectedSort, (k) => {
      return k.fieldname === o.field;
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
}
