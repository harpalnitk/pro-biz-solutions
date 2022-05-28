
import { CoreService } from '../../../../core/core.service';

import { AdminProfile } from '../../../../model/profile.model';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UserDialogComponent } from "../user-dialog/user-dialog.component";
import { Observable, Subject } from "rxjs";
import { AdminUsersService } from '../admin-users.service';

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  user: AdminProfile;
  width: string;
  isLoading$: Observable<boolean>;
  showHistoryButton = true;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private coreService: CoreService,
    private adminUsersService: AdminUsersService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    this.width = this.coreService.getWidth();
    this.user = this.route.snapshot.data["item"];
    console.log("Inside user", this.user);
    this.coreService.setIsLoading(false);
  }

getDialogConfig(){
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = this.width;
  dialogConfig.data = this.user;
  return dialogConfig;
}

  editUser() {
    const dialogConfig =this.getDialogConfig();
    this.dialog
      .open(UserDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val === "edit") {
          //reload product
          this.reloadUser();
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

  private reloadUser(){
    this.adminUsersService.getUserData(this.user.uid).subscribe(
      (val) => {
        this.user = val;
      },
      (err) => {
        console.log(err);
        this.coreService.presentSnackbar(
          "Error in updating the page after update in user"
        );
      }
    );
  }
  showHistory(){
   // this.router.navigate(['product',this.product.id, 'history']);
   //OR
    this.router.navigate(['history', {id: this.user.uid}], { relativeTo: this.route });
    this.showHistoryButton = false;
  }

}
