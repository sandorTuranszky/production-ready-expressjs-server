import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionsWrapperComponent } from './subscriptions-wrapper.component';

export const routes: Routes = [
  { path: '', component: SubscriptionsWrapperComponent }
 ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class SubscriptionsWrapperRoutingModule { }
