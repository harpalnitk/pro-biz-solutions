import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';
import { ProductItemResolver } from './product-item.resolver';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductComponent } from './product.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  {
    path: ':id',
    component: ProductItemComponent,
    resolve: {
        item: ProductItemResolver
    },
    children: [
      {
        path: 'history', // child route path
        component: ProductItemHistoryComponent, // child route component that the router renders
      },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
