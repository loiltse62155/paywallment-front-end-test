import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './result-screen/success/success.component';
import { ErrorComponent } from './result-screen/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent, data: { preload: true, delay: false } },
	{ path: 'success', component: SuccessComponent, data: { preload: true, delay: false } },
	{ path: 'error', component: ErrorComponent, data: { preload: true, delay: false } },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, 
    {
        useHash: true,
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
