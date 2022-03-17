import { DiscountItemHistoryComponent } from './discount-item/discount-item-history/discount-item-history.component';
import { DiscountItemResolver } from './discount-item.resolver';
import { DiscountItemComponent } from './discount-item/discount-item.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';

const routes: Routes = [
{ path: '', component: DiscountComponent },
{
  path: ":id",
  component: DiscountItemComponent,
  resolve: { item: DiscountItemResolver },
  children: [{ path: "history", component: DiscountItemHistoryComponent }],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
