import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsWrapperComponent } from './subscriptions-wrapper.component';
import { SubscriptionsWrapperRoutingModule } from './subscriptions-wrapper.routing.module';
import {SubscriptionsModule} from 'subscriptions';
@NgModule({
  declarations: [
    SubscriptionsWrapperComponent,
 ],
  imports: [
    CommonModule,
    SubscriptionsWrapperRoutingModule,
    SubscriptionsModule
  ]
})
export class SubscriptionsWrapperModule { }
