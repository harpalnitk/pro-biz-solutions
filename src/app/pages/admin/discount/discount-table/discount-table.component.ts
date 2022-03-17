import { Discount } from './../../../../model/discount';
import { DiscountDataSource } from "../discount.datasource";
import { CoreService } from "../../../../core/core.service";

import { DiscountDialogComponent } from "../discount-dialog/discount-dialog.component";

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { finalize, shareReplay, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AdminDiscountService } from "../admin-discount.service";

@Component({
  selector: "discount-table",
  templateUrl: "./discount-table.component.html",
  styleUrls: ["./discount-table.component.scss"],
})
export class DiscountTableComponent implements OnInit, AfterViewInit {
  // isLoading$: Observable<boolean>;
  displayedColumns: string[] = [
    "index",
    "name",
    "desc", //not useing typeView because in sorting need column name which is in database
    "value",
    "createdOn",
    "actions",
  ];
  width: string;

  dataSource: DiscountDataSource;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private adminDiscountService: AdminDiscountService,
    private coreService: CoreService,
    private dialog: MatDialog
  ) {
    this.width = this.coreService.getWidth();
    // this.isLoading$ = this.coreService.getIsLoading().pipe(
    //   shareReplay()
    // );
  }

  ngOnInit(): void {
    //this.loadProduct();
    // this.productAdminService.allProductForView$.subscribe(val => console.log('Val',val));
    this.dataSource = new DiscountDataSource(this.adminDiscountService);
    this.dataSource.loadDiscount();
  }

  // loadProduct(){
  //   this.coreService.setIsLoading(true);
  //   this.productAdminService
  //     .loadAllProduct()
  //     .pipe(
  //       finalize(() => {
  //         this.coreService.setIsLoading(false);
  //       })
  //     )
  //     .subscribe((value) => {
  //       console.log(value);
  //       this.dataSource = new MatTableDataSource(value);
  //       this.dataSource.sort = this.sort;
  //     },
  //     err=>{
  //       console.log(err);

  //     }
  //     );
  // }

  addDiscount() {
    const dialogConfig =this.getDialogConfig();

    this.dialog
      .open(DiscountDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        // this.loadProduct();
      });
  }

  getDialogConfig(){
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;
    
    return dialogConfig;
  }
  
    // onEditDiscount(discount: Discount) {
    //   const dialogConfig =this.getDialogConfig();
    //   dialogConfig.data = discount;
    //   this.dialog
    //     .open(DiscountDialogComponent, dialogConfig)
    //     .afterClosed()
    //     .subscribe((val) => {
    //       if (val === "edit") {
    //         //reload product
    //         //this.reloadDiscount();
    //       }
    //     });
    // }

  ngAfterViewInit() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
    // this.paginator.page
    // .pipe(
    //     tap(() => this.loadProductPage())
    // )
    // .subscribe();
    this.sort.sortChange.pipe(tap(() => this.loadDiscountPage())).subscribe();
  }

  loadDiscountPage() {
    this.dataSource.changeDiscountLoadParams(
      "",
      this.sort.active,
      this.sort.direction
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onDeleteDiscount(id: string) {
    this.coreService.setIsLoading(true);
    this.adminDiscountService
      .delete(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe(
        (value) => {
          this.coreService.presentSnackbar("Discount item deleted successfully");
          // this.loadProduct();
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
