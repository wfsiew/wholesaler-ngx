import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { ZXingScannerComponent } from '../../../modules/zxing-scanner/zxing-scanner.component';
import { Result } from '@zxing/library';
import { Quantity, ImageSnippet } from './models';
import { Helper } from '../../../shared/helpers';
import { AppConstant } from '../../../shared/constants/app.constant';
import { AppLocaleConstant } from '../../../shared/constants/app-locale.constant';
import { InventoryService } from '../../../services/inventory.service';
import { MessageService } from '../../../services/message.service';
import { ConfirmationService, MessageService as PMessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scan2dbarcode',
  templateUrl: './scan2dbarcode.component.html',
  styleUrls: ['./scan2dbarcode.component.css']
})
export class Scan2dbarcodeComponent implements OnInit, OnDestroy {

  barcode = '';
  expdate: Date;
  isVisibleDlg1 = false;
  isVisibleDlg2 = false;
  isVisibleDlg3 = false;
  isVisibleDlg4 = false;
  lsqty: Quantity[];
  quantity: Quantity;
  productInfo: any = {};
  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;

  selectedFile: ImageSnippet;
  allowscan = true;
  subscription: Subscription;

  readonly AppConstant = AppConstant;
  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private location: Location,
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private pmessageService: PMessageService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.subscription = this.messageService.get().subscribe(x => {
      if (x.name === 'add-product') {
        const o = x.data;
        this.barcode = o.barcode;
      } else if (x.name === 'add-product-cancel') {
        const o = x.data;
        this.cancelPreviousBarcode(o.barcode);
      }
    });
    this.load();
    this.initScanner();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initScanner() {
    try {
      if (this.scanCount === AppConstant.MAX_SCAN) {
        this.allowscan = false;
      } else {
        this.allowscan = true;
      }
      // if (!this.allowscan) return;
      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasDevices = true;
        this.availableDevices = devices;
        this.onDeviceSelectChange(devices[0].deviceId);

        // selects the devices's back camera by default
        // for (const device of devices) {
        //     if (/back|rear|environment/gi.test(device.label)) {
        //         this.scanner.changeDevice(device);
        //         this.currentDevice = device;
        //         break;
        //     }
        // }
      });

      this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
      this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
      this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
    } catch (err) { }
  }

  cancelPreviousBarcode(barcode: string) {
    this.decrementBarcodeCount(barcode);
    this.reduceScanCount();
  }

  reduceScanCount() {
    let n = this.scanCount;
    if (n > 0) {
      n -= 1;
    }

    this.scanCount = n;
    if (this.scanCount < AppConstant.MAX_SCAN) {
      this.allowscan = true;
    }
  }

  setScanCount() {
    let n = this.scanCount;
    n += 1;
    this.scanCount = n;
    if (this.scanCount >= AppConstant.MAX_SCAN) {
      this.allowscan = false;
    }
  }

  decrementBarcodeCount(barcode: string) {
    const lx = this.barcodes;
    const i = _.findIndex(lx, (k) => {
      return k.barcode === barcode;
    });
    if (i >= 0) {
      const o = lx[i];
      o.count = o.count - 1;
      lx[i] = o;
      if (o.count < 1) {
        const x = _.remove(lx, (k) => {
          return k.barcode === barcode;
        });
        this.barcodes = lx;
      }
    }
  }

  incrementBarcodeCount() {
    let lx = this.barcodes;
    if (Helper.isEmpty(lx)) {
      lx = [{ barcode: this.barcode, count: 1 }];
      this.barcodes = lx;
    } else {
      const i = _.findIndex(lx, (k) => {
        return k.barcode === this.barcode;
      });
      if (i >= 0) {
        lx[i].count += 1;
      } else {
        lx.push({ barcode: this.barcode, count: 1 });
      }
      this.barcodes = lx;
    }
  }

  load() {
    this.inventoryService.get_productQtyList().subscribe((res: any) => {
      this.lsqty = res;
      if (Helper.isEmpty(this.quantity)) {
        this.quantity = res[0];
      }
    },
    (err: any) => {
      this.handleError(err, 'LOAD QUANTITY');
    });
  }

  onBack() {
    this.router.navigate(['products']);
  }

  displayCameras(cameras: MediaDeviceInfo[]) {
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.barcode = resultString;
    this.setScanCount();
    this.checkBarcodeExist();
  }

  onDeviceSelectChange(selectedValue: string) {
    this.currentDevice = this.scanner.getDeviceById(selectedValue);
  }

  onDlg2Hide(event) {
    this.cancelPreviousBarcode(this.barcode);
  }

  onManualInput() {
    this.barcode = '';
    this.isVisibleDlg1 = true;
  }

  onDone() {
    this.isVisibleDlg3 = true;
  }

  clearBarcode() {
    this.barcode = '';
  }

  onConfirmBarcode() {
    if (!this.isValidBarcode()) {
      this.handleError('Barcode is invalid', '');
      return;
    }

    this.isVisibleDlg1 = false;
    // this.setScanCount();
    this.checkBarcodeExist();
  }

  onCancelBarcode() {
    this.isVisibleDlg1 = false;
  }

  onConfirmExpiryDate() {
    this.isVisibleDlg3 = false;
    if (this.expdate == null) {
      this.addBatch('');
    } else {
      const ds = Helper.getUTCDateStr(this.expdate);
      this.addBatch(ds);
    }
  }

  onResetExpiryDate() {
    this.expdate = undefined;
  }

  onCancelExpiryDate() {
    this.isVisibleDlg3 = false;
  }

  onSubmit() {
    this.isVisibleDlg2 = false;
    const o = {
      barcode: this.barcode,
      quantity: Helper.isEmpty(this.quantity) ? { id: 0, qty: 0 } : this.quantity,
      image: this.selectedFile,
      isAdd: true
    };

    this.messageService.send('scanbarcode', o);
    this.router.navigate(['products/add']);
  }

  isValidBarcode() {
    if (Helper.isEmpty(this.barcode)) {return true; }
    const r = AppConstant.VALIDATEFORM.BARCODE.test(this.barcode);
    return r;
  }

  addBatch(expiry_date: string) {
    const lx = this.barcodes;
    const o = {
      barcodes: lx,
      scanned_summary: {
        id: this.scannedSummaryID
      }
    };
    if (!Helper.isEmpty(expiry_date)) {
      o['expiry_date'] = expiry_date;
    }
    this.inventoryService.post_addBatch(o).subscribe((res: any) => {
      localStorage.removeItem('scan-count');
      localStorage.removeItem('barcodes');
      this.router.navigate(['products/scan-summary']);
      // this.pmessageService.add({ severity: 'success', summary: 'ADD BATCH', detail: 'Add Batch sucessful', key: 'toast' });
    },
    (err: any) => {
      this.handleError(err, 'ADD BATCH');
    });
  }

  checkBarcodeExist() {
    const i = _.findIndex(this.barcodes, (o) => {
      return o.barcode === this.barcode;
    });
    if (i < 0) {
      this.inventoryService.get_checkBarcodeExist(this.barcode, this.scannedSummaryID).subscribe((res: any) => {
        this.scannedSummaryID = res.scanned_summary.id;
        if (res.result) {
          this.productInfo = res;
          this.proceedBarcodeExist();
        } else {
          this.proceedBarcodeNotExist();
        }
      },
      (err: any) => {
        this.handleError(err, 'CHECK BARCODE EXIST');
      });
    } else {
      this.proceedBarcodeExist();
    }
  }

  proceedBarcodeExist() {
    this.isVisibleDlg4 = true;
    // this.translateService.get([
    //   AppLocaleConstant.OK,
    //   AppLocaleConstant.CANCEL,
    //   AppLocaleConstant.BARCODE_EXIST_MSG
    // ])
    // .subscribe(res => {
    //   this.confirmationService.confirm({
    //     acceptLabel: res[AppLocaleConstant.OK],
    //     rejectLabel: res[AppLocaleConstant.CANCEL],
    //     message: res[AppLocaleConstant.BARCODE_EXIST_MSG],
    //     accept: () => {
    //       this.incrementBarcodeCount();
    //     },
    //     reject: () => {
    //     }
    //   });
    // });
  }

  confirmExistBardCode() {
    this.setScanCount();
    this.isVisibleDlg4 = false;
    this.incrementBarcodeCount();
    this.isVisibleDlg2 = true;
  }

  cancelExistBardCode() {
    // localStorage.setItem('scan-count', `${this.scanCount - 1}`);
    this.isVisibleDlg4 = false;
  }

  proceedBarcodeNotExist() {
    this.incrementBarcodeCount();
    this.isVisibleDlg2 = true;
  }

  processFile(imFile: any) {
    const file: File = imFile.files[0];
    const rd = new FileReader();
    rd.addEventListener('load', (event: any) => {
      console.log(event);
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    rd.readAsDataURL(file);
  }

  uploadFile(event) {
    console.log('upload file', event.files);
  }

  onClear() {
    this.selectedFile = null;
  }

  onRemove(event) {
    this.onClear();
  }

  get barcodes() {
    const s = localStorage.getItem('barcodes');
    let lx = [];
    if (!Helper.isEmpty(s)) {
      lx = JSON.parse(s);
    }

    return lx;
  }

  set barcodes(lx) {
    const s = JSON.stringify(lx);
    localStorage.setItem('barcodes', s);
  }

  get scanCount() {
    const s = localStorage.getItem('scan-count');
    let n = 0;
    if (!Helper.isEmpty(s)) {
      n = parseInt(s);
    }
    return n;
  }

  set scanCount(n) {
    localStorage.setItem('scan-count', `${n}`);
  }

  get scannedSummaryID() {
    const s = localStorage.getItem('scanned_summary_id');
    let n = 0;
    if (!Helper.isEmpty(s)) {
      n = parseInt(s);
    }

    return n;
  }

  set scannedSummaryID(id) {
    localStorage.setItem('scanned_summary_id', `${id}`);
  }

  handleError(err, sumary) {
    this.pmessageService.add({ severity: 'error', summary: sumary, detail: err });
  }
}
