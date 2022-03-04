import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProductTableComponent } from './product-table/product-table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductQtyDialogComponent } from './product-qty-dialog/product-qty-dialog.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductTableComponent,
    ProductDialogComponent,
    ProductItemComponent,
    ProductQtyDialogComponent,
    ProductItemHistoryComponent
  ],
  imports: [
    SharedModule,
    ProductRoutingModule
  ]
})
export class ProductsModule { }
