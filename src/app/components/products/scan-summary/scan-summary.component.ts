import { Component, OnInit } from '@angular/core';
import { Helper } from '../../../shared/helpers';
import { AppConstant } from '../../../shared/constants/app.constant';
import { AppLocaleConstant } from '../../../shared/constants/app-locale.constant';
import { InventoryService } from '../../../services/inventory.service';
import { MessageService as PMessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-summary',
  templateUrl: './scan-summary.component.html',
  styleUrls: ['./scan-summary.component.css']
})
export class ScanSummaryComponent implements OnInit {

  data = {
    scanned_summary: {
      new_product: {},
      variations: []
    },
    scanned_products: []
  };

  readonly AppConstant = AppConstant;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private pmessageService: PMessageService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.inventoryService.get_addBatchResponse(this.scannedSummaryID).subscribe((res: any) => {
      this.data = res;
    },
    (err: any) => {
      this.handleError(err, 'LOAD');
    });
  }

  downloadQRCodeAll() {
    this.inventoryService.get_scannedBatchQRCodeAll(this.scannedSummaryID).subscribe((res) => {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(res, 'qrcode-batch-all.pdf');
        return;
      }

      const data = URL.createObjectURL(res);
      window.open(data, '_blank');
    },
    (err: any) => {
      this.handleError(err, 'DOWNLOAD ALL QR CODE');
    });
  }

  onClickHere() {
    this.router.navigate(['products']);
  }

  downloadQRCode(id) {
    this.inventoryService.get_scannedBatchQRCode(this.scannedSummaryID, id).subscribe((res: any) => {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(res, 'qrcode-batch.pdf');
        return;
      }

      const data = URL.createObjectURL(res);
      window.open(data, '_blank');
    },
    (err: any) => {
      this.handleError(err, 'DOWNLOAD QR CODE');
    });
  }

  get scannedSummaryID() {
    const s = localStorage.getItem('scanned_summary_id');
    const n = parseInt(s);
    return n;
  }

  handleError(err, sumary) {
    this.pmessageService.add({ severity: 'error', summary: sumary, detail: err });
  }
}
