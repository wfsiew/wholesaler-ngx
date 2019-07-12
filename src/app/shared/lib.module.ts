import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '../modules/zxing-scanner/zxing-scanner.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  imports: [
    ZXingScannerModule.forRoot(),

    QRCodeModule,
    NgxBarcodeModule
  ],
  exports: [
    ZXingScannerModule,
    QRCodeModule,
    NgxBarcodeModule
  ]
})
export class LibModule { }
