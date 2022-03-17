import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemResolver } from './product-item.resolver';
import { ProductItemHistoryComponent } from './product-item/product-item-history/product-item-history.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductComponent } from './product.component';

const routes: Routes = [{ path: '', component: ProductComponent },
{
  path: ":id",
  component: ProductItemComponent,
  resolve: { item: ProductItemResolver },
  children: [{ path: "history", component: ProductItemHistoryComponent }],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
