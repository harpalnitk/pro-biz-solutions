import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProductTableComponent } from './product-table/product-table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductQtyDialogComponent } from './product-qty-dialog/product-qty-dialog.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';


@NgModule({
  declarations: [
    AdminComponent,
    ProductTableComponent,
    ProductDialogComponent,
    ProductItemComponent,
    ProductQtyDialogComponent,
    ProductItemHistoryComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
