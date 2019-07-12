import { NgModule } from '@angular/core';
import { ModalModule, ButtonsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    ModalModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  exports: [
    ModalModule,
    ButtonsModule
  ]
})
export class NgxBootstrapModule { }