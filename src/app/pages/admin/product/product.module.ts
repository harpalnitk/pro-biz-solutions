import { NgModule } from '@angular/core';


import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductQtyDialogComponent } from './product-qty-dialog/product-qty-dialog.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';
import { SharedModule } from 'app/shared/shared.module';


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
export class ProductModule { }
