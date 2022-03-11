import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './products-routing.module';
import { PublicProductsComponent } from './products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PublicProductItemComponent } from './public-product-item/public-product-item.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';


@NgModule({
  declarations: [
    PublicProductsComponent,
    ProductListComponent,
    PublicProductItemComponent,
    ProductDetailComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
