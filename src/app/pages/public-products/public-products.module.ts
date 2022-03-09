import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { PublicProductsRoutingModule } from './public-products-routing.module';
import { PublicProductsComponent } from './public-products.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { PublicProductItemComponent } from './public-product-item/public-product-item.component';


@NgModule({
  declarations: [
    PublicProductsComponent,
    ProductlistComponent,
    PublicProductItemComponent
  ],
  imports: [
    SharedModule,
    PublicProductsRoutingModule
  ]
})
export class PublicProductsModule { }
