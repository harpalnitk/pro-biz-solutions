import { ProductDetailResolver } from './product-detail.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicProductsComponent } from './products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
{ path: '',
   component: PublicProductsComponent 
},
{
  path: ':id',
  component: ProductDetailComponent,
  resolve: {
      item: ProductDetailResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
