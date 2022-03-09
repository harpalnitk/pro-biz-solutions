import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicProductsComponent } from './public-products.component';

const routes: Routes = [{ path: '', component: PublicProductsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicProductsRoutingModule { }
