
import { CoreService } from '../../../core/core.service';

import { Product } from '../../../model/product';
import { ProductQtyDialogComponent } from '../product-qty-dialog/product-qty-dialog.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProductDialogComponent } from "../product-dialog/product-dialog.component";
import { Observable, Subject } from "rxjs";
import { ProductAdminService } from '../admin-product.service';

@Component({
  selector: "product-item",
  templateUrl: "./product-item.component.html",
  styleUrls: ["./product-item.component.scss"],
})
export class ProductItemComponent implements OnInit {
  product: Product;
  width: string;
  isLoading$: Observable<boolean>;
  showHistoryButton = true;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private coreService: CoreService,
    private productAdminService: ProductAdminService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    this.width = this.coreService.getWidth();
    this.product = this.route.snapshot.data["item"];
   // console.log("Inside product item", this.product);
    this.coreService.setIsLoading(false);
  }

getDialogConfig(){
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = this.width;
  dialogConfig.data = this.product;
  return dialogConfig;
}

  editProduct() {
    const dialogConfig =this.getDialogConfig();
    this.dialog
      .open(ProductDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val === "edit") {
          //reload product
          this.reloadProduct();
        }
      });
  }

  changeProductQuantity(val: number){
    const dialogConfig = this.getDialogConfig();
    dialogConfig.data = {product: this.product, add: val};
    this.dialog
    .open(ProductQtyDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe((val) => {
      if (val === "edit") {
        //reload product
         this.reloadProduct();
      }
    });
  }

  private reloadProduct(){
    this.productAdminService.getProductData(this.product.id).subscribe(
      (val) => {
        this.product = val;
      },
      (err) => {
        console.log(err);
        this.coreService.presentSnackbar(
          "Error in updating the page after update"
        );
      }
    );
  }
  showHistory(){
   // this.router.navigate(['product',this.product.id, 'history']);
   //OR
    this.router.navigate(['history', {id: this.product.id}], { relativeTo: this.route });
    this.showHistoryButton = false;
  }

}
