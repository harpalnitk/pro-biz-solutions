import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';
import { DiscountTableComponent } from './discount-table/discount-table.component';
import { DiscountItemHistoryComponent } from './discount-item/discount-item-history/discount-item-history.component';
import { DiscountItemComponent } from './discount-item/discount-item.component';


@NgModule({
  declarations: [
    DiscountComponent,
    DiscountDialogComponent,
    DiscountTableComponent,
    DiscountItemComponent,
    DiscountItemHistoryComponent
  ],
  imports: [
    SharedModule,
    DiscountRoutingModule
  ]
})
export class DiscountModule { }
