import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CustomersComponent } from '../../components/customers/customer-list/customers.component';
import { WSRouter } from '../../components/routes/ws-router.component';
import { CustomerDetailsComponent } from '../../components/customers/customer-details/customer-details.component';
import { CustomerProfileComponent } from '../../components/customers/customer/customer-profile.component';
import { TradeOfferComponent } from '../../components/customers/trade-offer/trade-offer.component';
import { TransactionHistComponent } from '../../components/customers/transaction-hist/transaction-hist.component';
import { AuthGuardService } from '../login/auth-guard.service';

const routes: Routes = [
  {
    path: 'customer', component: CustomersComponent,
    canActivate: [AuthGuardService], children: [
      {
        path: '', component: CustomerDetailsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'details/:id', component: CustomerDetailsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'profile/:id', component: CustomerProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'trade-offer/:id', component: TradeOfferComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'trasaction-history/:id', component: TransactionHistComponent,
        canActivate: [AuthGuardService]
      }
    ]
  },
  {path : '**', redirectTo: 'customer',
  canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
