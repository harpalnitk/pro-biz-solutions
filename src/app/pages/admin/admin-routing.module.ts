import { ProductItemHistoryComponent } from "./product/product-item/product-item-history/product-item-history.component";
import { ProductItemResolver } from "./product/product-item.resolver";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductItemComponent } from "./product/product-item/product-item.component";
import { AdminComponent } from "./admin.component";
import { ProductTableComponent } from "./product/product-table/product-table.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "product",
        loadChildren: () =>
          import("./product/product.module").then((m) => m.ProductModule),
      },
      {
        path: "discount",
        loadChildren: () =>
          import("./discount/discount.module").then((m) => m.DiscountModule),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
