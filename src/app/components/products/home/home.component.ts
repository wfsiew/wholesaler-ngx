import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { Helper } from '../../../shared/helpers';
import { Sort, SORT_ORDER, Pager } from '../../../shared/models/general';
import { AppConstant } from '../../../shared/constants/app.constant';
import { AppLocaleConstant } from '../../../shared/constants/app-locale.constant';
import { InventoryService } from '../../../services/inventory.service';
import { MessageService } from '../../../services/message.service';
import { SharedService } from 'src/app/services/shared.service';
import { MessageService as PMessageService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  SORT_FIELD = {
    NAME: 'name',
    QTY: 'total_qty'
  };

  xmenu = '';

  SORT_OPTIONS = [
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi-inbox-arrow-down',
      name: 'Least Stock Balance'
    },
    {
      field: this.SORT_FIELD.QTY,
      order: SORT_ORDER.DESC,
      icon: 'mdi mdi-inbox-arrow-up',
      name: 'Top Stock Balance'
    },
    {
      field: this.SORT_FIELD.NAME,
      order: SORT_ORDER.ASC,
      icon: 'mdi mdi-alpha-a-box-outline',
      name: 'Product Name A-Z'
    },
    {
      field: this.SORT_FIELD.NAME,
      order: SORT_ORDER.DESC,
      icon: 'mdi mdi-alpha-z-box-outline',
      name: 'Product Name Z-A'
    }
  ];

  display = false;
  term = '';
  searchTerm: any;
  results = [];
  lscategory = [];
  lsSelectedCategory = [];
  lsSelectedSort = [];
  pager = new Pager(1);
  list: [];
  items2: MenuItem[];
  isloading = false;
  subscription: Subscription;

  readonly AppConstant = AppConstant;
  readonly SORT_ORDER = SORT_ORDER;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private shareService: SharedService,
    private pmessageService: PMessageService) { }

  ngOnInit() {
    this.subscription = this.messageService.get().subscribe(x => {
      if (x.name == 'home') {
        let o = x.data;
        this.loadState(o);
      }
    });
    this.load();
    this.renewScan();
    this.loadCategory();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCategory() {
    this.inventoryService.get_productCategoryList().subscribe((res: any) => {
      this.lscategory = res;
    },
    (err) => {
      this.handleError(err, 'LOAD PRODUCT CATEGORY');
    });
  }

  renewScan() {
    this.shareService.clearScan();
  }

  search(event) {
    let term = event.query;
    this.term = event.query;
    this.inventoryService.get_productLookup(term).subscribe((res: any) => {
      this.results = res;
    });
  }

  onKeyUpSearch(event) {
    if (event.key === 'Enter') {
      if (!Helper.isEmpty(this.searchTerm)) {
        if (_.isObject(this.searchTerm)) {
          this.term = this.searchTerm.name;
        }

        else {
          this.term = this.searchTerm;
        }
      }

      else {
        this.term = '';
      }

      this.refresh();
    }

    else if (Helper.isEmpty(this.searchTerm)) {
      this.term = '';
      this.refresh();
    }
  }

  saveState() {
    this.messageService.send('home', { 
      page: this.pager.page,
      term: this.term, 
      selectedCategory: this.lsSelectedCategory, 
      selectedSort: this.lsSelectedSort 
    });
  }

  loadState(o) {
    this.pager.page = o.page;
    this.term = o.term;
    this.lsSelectedCategory = o.selectedCategory;
    this.lsSelectedSort = o.selectedSort;
    this.searchTerm = { id: 0, name: this.term };
  }

  getBlankPicture(s) {
    if (Helper.isNull(s)) {
      return 'assets/img/cube.png';
    }
    return s;
  }

  onSelectSearchTerm(value) {
    this.term = value.name;
    this.refresh();
  }

  setCategory(id) {
    let i = _.indexOf(this.lsSelectedCategory, id);
    if (i < 0) {
      this.lsSelectedCategory.push(id);
    }

    else {
      let lx = _.remove(this.lsSelectedCategory, (k) => {
        return k == id;
      });
    }

    this.refresh();
  }

  isCategorySelected(id) {
    let i = _.indexOf(this.lsSelectedCategory, id);
    return i >= 0 ? true : false;
  }

  getCategory() {
    if (_.isEmpty(this.lsSelectedCategory)) {
      return '';
    }

    return _.join(this.lsSelectedCategory, ':');
  }

  getSort() {
    let lx = [];
    _.each(this.lsSelectedSort, (k) => {
      lx.push(k.toString());
    });
    return _.join(lx, '$');
  }

  refresh() {
    this.pager.page = 1;
    this.load();
  }

  load() {
    this.isloading = true;
    this.inventoryService.get_productList(this.term, this.pager.page, AppConstant.PAGE_SIZE, this.getSort(),
    this.getCategory()).subscribe((res: any) => {
      this.pager.setFromHeaders(res.headers);
      this.list = res.body;
      this.isloading = false;
    },
    (err: any) => {
      this.isloading = false;
      this.handleError(err, 'LOAD');
    });
  }

  btnAdd() {
    this.saveState();
    this.router.navigate(['products/scan2dbarcode']);
  }

  onPageChange(event) {
    this.pager.page = event.page + 1;
    this.load();
  }

  onSort(o) {
    let i = _.findIndex(this.lsSelectedSort, (k) => {
      return k.fieldname == o.field;
    });
    if (i >= 0) {
      if (this.lsSelectedSort[i].order == o.order) {
        _.remove(this.lsSelectedSort, (k) => {
          return k.fieldname == o.field;
        });
      }

      else {
        this.lsSelectedSort[i].order = o.order;
      }
    }

    else {
      this.lsSelectedSort.push(new Sort(o.field, o.order));
    }

    this.refresh();
  }

  isSortSelected(o) {
    let i = _.findIndex(this.lsSelectedSort, (k) => {
      return k.fieldname == o.field && k.order == o.order;
    });
    return i >= 0 ? true : false;
  }

  prepcm(o) {
    this.items2 = [
      {
        label: 'Edit Product Info', command: (event) => {
          this.editProductInfo(o.id);
        }
      },
      {
        label: 'View Product', command: (event) => {
          this.viewProductInfo();
        }
      },
      { label: 'List 2 (csv)', command: (event) => { } }
    ];
  }

  opencm(event, cm, o) {
    event.preventDefault();
    event.stopPropagation();
    this.prepcm(o);
    cm.show(event);
    return false;
  }

  editProductInfo(id) {
    this.saveState();
    this.router.navigate(['products/edit/', id]);
  }

  viewProductInfo() {
    this.saveState();
    this.router.navigate(['products/var-product']);
  }

  closeNave(event) {
    console.log(event);
  }

  isOutOfStock(o) {
    return o.total_qty == 0;
  }

  isStockBelowParLevel(o) {
    return o.total_qty > 0 && o.par_level > 0 && o.total_qty < o.par_level;
  }

  clear() {
    this.lsSelectedCategory = [];
    this.lsSelectedSort = [];
    this.term = '';
    this.display = false;
    this.refresh();
  }

  handleError(err, summary) {
    this.pmessageService.add({ severity: 'error', summary: summary, detail: err });
  }
}