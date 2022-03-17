
import { CoreService } from '../../../../core/core.service';

import { Discount } from '../../../../model/discount';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DiscountDialogComponent } from "../discount-dialog/discount-dialog.component";
import { Observable, Subject } from "rxjs";
import { AdminDiscountService } from '../admin-discount.service';

@Component({
  selector: "discount-item",
  templateUrl: "./discount-item.component.html",
  styleUrls: ["./discount-item.component.scss"],
})
export class DiscountItemComponent implements OnInit {
  discount: Discount;
  width: string;
  isLoading$: Observable<boolean>;
  showHistoryButton = true;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private coreService: CoreService,
    private adminDiscountService: AdminDiscountService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    this.width = this.coreService.getWidth();
    this.discount = this.route.snapshot.data["item"];
   console.log("Inside discount item", this.discount);
    this.coreService.setIsLoading(false);
  }

getDialogConfig(){
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = this.width;
  dialogConfig.data = this.discount;
  return dialogConfig;
}

  editDiscount() {
    const dialogConfig =this.getDialogConfig();
    this.dialog
      .open(DiscountDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val === "edit") {
          //reload product
          this.reloadDiscount();
        }
      });
  }

  // changeProductQuantity(val: number){
  //   const dialogConfig = this.getDialogConfig();
  //   dialogConfig.data = {product: this.product, add: val};
  //   this.dialog
  //   .open(ProductQtyDialogComponent, dialogConfig)
  //   .afterClosed()
  //   .subscribe((val) => {
  //     if (val === "edit") {
  //       //reload product
  //        this.reloadProduct();
  //     }
  //   });
  // }

  private reloadDiscount(){
    this.adminDiscountService.getDiscountData(this.discount.id).subscribe(
      (val) => {
        this.discount = val;
      },
      (err) => {
        console.log(err);
        this.coreService.presentSnackbar(
          "Error in updating the page after update in discount"
        );
      }
    );
  }
  showHistory(){
   // this.router.navigate(['product',this.product.id, 'history']);
   //OR
    this.router.navigate(['history', {id: this.discount.id}], { relativeTo: this.route });
    this.showHistoryButton = false;
  }

}
