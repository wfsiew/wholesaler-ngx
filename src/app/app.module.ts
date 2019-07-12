import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/products/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { HttpTimeoutInterceptor } from './shared/interceptors/timeout-interceptor';
import { AuthService } from './components/login/auth.service';
import { AuthGuardService } from './components/login/auth-guard.service';
import { Scan2dbarcodeComponent } from './components/products/scan2dbarcode/scan2dbarcode.component';
import { EditProductInfoComponent } from './components/products/edit-product-info/edit-product-info.component';
import { ScanSummaryComponent } from './components/products/scan-summary/scan-summary.component';
import { HeaderComponent } from './layout/header/header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PrimengModule } from './shared/primeng.module';
import { NgxBootstrapModule } from './shared/ngxbootstrap.module';
import { LibModule } from './shared/lib.module';
import { InventoryService } from './services/inventory.service';
import { CustomerService } from './services/customer.service';
import { MessageService } from './services/message.service';
import { ConfirmationService, MessageService as PMessageService } from 'primeng/api';
import { PageService } from './services/page.service';
import { SmCard } from './shared/components/sm-card/sm-card.component';
import { ProductVariantComponent } from './components/products/product-variant/product-variant.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { VariantsComponent } from './components/products/variants/variants.component';
import { CustomersComponent } from './components/customers/customer-list/customers.component';
import { WSRouter } from './components/routes/ws-router.component';
import { WishListComponent } from './components/customers/wish-list/wish-list.component';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { TradeOfferComponent } from './components/customers/trade-offer/trade-offer.component';
import { TransactionHistComponent } from './components/customers/transaction-hist/transaction-hist.component';
import {AccordionModule} from 'primeng/primeng';
import { CustomerProfileComponent } from './components/customers/customer/customer-profile.component';
// import { CustomerRoutingModule } from './components/customers/customer-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DataPipePipe } from './shared/pipe/data-pipe.pipe';
import { SharedService } from './services/shared.service';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    WSRouter,
    LogoutComponent,
    Scan2dbarcodeComponent,
    HeaderComponent,
    ScanSummaryComponent,
    ProductVariantComponent,
    SmCard,
    LoaderComponent,
    EditProductInfoComponent,
    VariantsComponent,
    CustomersComponent,
    WishListComponent,
    CustomerDetailsComponent,
    TradeOfferComponent,
    TransactionHistComponent,
    CustomerProfileComponent,
    DataPipePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule,
    DynamicDialogModule,
    HttpClientModule,
    FormsModule,
    AccordionModule,
    ReactiveFormsModule,
    PrimengModule,
    NgxBootstrapModule,
    LibModule,
    RadioButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    PageService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTimeoutInterceptor,
      multi: true
    },
    InventoryService,
    CustomerService,
    SharedService,
    MessageService,
    ConfirmationService,
    PMessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
