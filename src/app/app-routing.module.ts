import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/products/home/home.component';
import { Scan2dbarcodeComponent } from './components/products/scan2dbarcode/scan2dbarcode.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthGuardService } from './components/login/auth-guard.service';
import { ScanSummaryComponent } from './components/products/scan-summary/scan-summary.component';
import { EditProductInfoComponent } from './components/products/edit-product-info/edit-product-info.component';
import { ProductVariantComponent } from './components/products/product-variant/product-variant.component';
import { VariantsComponent } from './components/products/variants/variants.component';
import { CustomersComponent } from './components/customers/customer-list/customers.component';
import { WSRouter } from './components/routes/ws-router.component';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { CustomerProfileComponent } from './components/customers/customer/customer-profile.component';
import { TradeOfferComponent } from './components/customers/trade-offer/trade-offer.component';
import { TransactionHistComponent } from './components/customers/transaction-hist/transaction-hist.component';
import { WishListComponent } from './components/customers/wish-list/wish-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'products', component: WSRouter, canActivate: [AuthGuardService],
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
      { path: 'scan2dbarcode', component: Scan2dbarcodeComponent, canActivate: [AuthGuardService] },
      { path: 'edit/:id', component: EditProductInfoComponent, canActivate: [AuthGuardService] },
      { path: 'add', component: EditProductInfoComponent, canActivate: [AuthGuardService] },
      { path: 'scan-summary', component: ScanSummaryComponent, canActivate: [AuthGuardService] },
      { path: 'variant/:id/:vid', component: ProductVariantComponent, canActivate: [AuthGuardService] },
    ]
  },
  {
    path: 'customer', component: WSRouter, canActivate: [AuthGuardService], children:
    [
      { path: '', component: CustomersComponent, canActivate: [AuthGuardService] },
      { path: 'details/:id', component: CustomerDetailsComponent, canActivate: [AuthGuardService] },
      { path: 'profile/:id', component: CustomerProfileComponent, canActivate: [AuthGuardService] },
      { path: 'trade-offer/:id', component: TradeOfferComponent, canActivate: [AuthGuardService] },
      { path: 'wish-lisht/:id', component: WishListComponent, canActivate: [AuthGuardService] },
      { path: 'tras-history/:id', component: TransactionHistComponent, canActivate: [AuthGuardService] }
    ]
  },
  { path: '', component: LoginComponent },
  { path : '**', redirectTo: 'products', canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
