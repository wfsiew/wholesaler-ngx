import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';
import { Helper } from '../../../shared/helpers';
import { Sort, SORT_ORDER, Pager } from '../../../shared/models/general';
import { AppConstant } from '../../../shared/constants/app.constant';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from '../../../services/message.service';
import { MessageService as PMessageService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})


export class CustomersComponent implements OnInit {
  // isSelectedTradOffer: boolean = false;
  SORT_FIELD = {
    COMPANY_NAME: 'company_name'
  };

  isSelected = false;
  defaultImage = 'assets/img/cube.png';
  selectedSort = null;
  page = 1;
  pager = new Pager(1);
  list: any = [];
  items2: any = [];
  isloading = false;
  display = false;
  results: any [];
  searchTerm: any;
  term = '';
  xmenu = '';

  readonly AppConstant = AppConstant;
  readonly SORT_ORDER = SORT_ORDER;
  readonly isEmpty = Helper.isEmpty;
  readonly getBlankProfilePicture = Helper.getBlankProfilePicture;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private messageService: MessageService,
    private pmessageService: PMessageService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.isloading = true;
    this.customerService.get_customerList(this.isSelected, this.pager.page, AppConstant.PAGE_SIZE, '').subscribe((res: any) => {
      this.pager.setFromHeaders(res.headers);
      this.list = res.body;

      _.forEach(this.list, (k) => {
        if (this.isEmpty(k.picture)) {
          this.defaultImage = k.picture;
        }
      });
      // for(let i = 0; i < this.list.length; i++) {
      //   if (this.list[i].picture) {
      //     this.defaultImage = this.list[i].picture;
      //   }
      // }
      this.isloading = false;
    },
    (err: any) => {
      this.isloading = false;
      this.handleError(err, 'LOAD');
    });
  }

  tradOffer() {
    this.isSelected = !this.isSelected;
    this.load();
  }

  footerSort(idx) {
    this.selectedSort = idx;
  }

  search(terms) {
    this.term = terms.query;
    const tradeOffer = this.isSelected;
    this.customerService.get_searchCustomer(this.term, tradeOffer, this.pager.page, AppConstant.PAGE_SIZE, '').
    subscribe((res: any) => {
      this.results = res.body;
    });
  }

  loadFilter() {
    this.customerService.get_searchCustomer(this.term, this.isSelected, this.pager.page, AppConstant.PAGE_SIZE, '').
    subscribe((res: any) => {
      this.list = res.body;
      this.pager.setFromHeaders(res.headers);
    });
  }

  onSelectSearchTerm(value) {
    this.term = value.company_name;
    this.refresh();
  }

  refresh() {
    this.pager.page = 1;
    this.loadFilter();
  }

  onKeyUpSearch(event) {
    if (event.key === 'Enter') {
      if (!Helper.isEmpty(this.searchTerm)) {
        if (_.isObject(this.searchTerm)) {
          this.term = this.searchTerm.company_name;
        } else {
          this.term = this.searchTerm;
        }
      } else {
        this.term = '';
      }
      this.refresh();
    } else if (Helper.isEmpty(this.searchTerm)) {
      this.term = '';
      this.refresh();
    }
  }

  opencm(event, cm, o) {
    event.preventDefault();
    event.stopPropagation();
    this.prepcm(o);
    cm.show(event);
    return false;
  }

  prepcm(o) {
    this.items2 = [
      {
        label: 'Edit Customer Profile', command: (event) => {
          this.editCustomerProfile(o.id);
        }
      },
    ];
  }

  editCustomerProfile(id) {
    this.router.navigate(['customer/trade-offer/', id]);
  }

  handleError(err, samry) {
    this.pmessageService.add({ severity: 'error', summary: samry, detail: err });
  }

  onPageChange(event) {
    this.pager.page = event.page + 1;
    this.load();
  }

  getBlankPicture(s) {
    if (Helper.isNull(s)) {
      return 'assets/img/cube.png';
    }
    return s;
  }
}
