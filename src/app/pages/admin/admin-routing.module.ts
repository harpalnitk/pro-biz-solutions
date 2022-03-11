import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';
import { ProductItemResolver } from './product-item.resolver';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { AdminComponent } from './admin.component';
import { ProductTableComponent } from './product-table/product-table.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children:
    [
      { path: 'product-table', component: ProductTableComponent },
      { path: ':id',component: ProductItemComponent, resolve: {item: ProductItemResolver},
           children: [{ path: 'history', // child route pathcomponent: ProductItemHistoryComponent, // child route component that the router renders
    },
  ]
},]
},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
