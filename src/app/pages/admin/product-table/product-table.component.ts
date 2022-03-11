import { ProductDataSource } from '../product.datasource';
import { CoreService } from '../../../core/core.service';
import { Product } from '../../../model/product';


import { ProductDialogComponent } from "../product-dialog/product-dialog.component";

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { finalize, shareReplay, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProductAdminService } from '../admin-product.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "product-table",
  templateUrl: "./product-table.component.html",
  styleUrls: ["./product-table.component.scss"],
})
export class ProductTableComponent implements OnInit, AfterViewInit {
 // isLoading$: Observable<boolean>;
  displayedColumns: string[] = [
    "index",
    "name",
    "type", //not useing typeView because in sorting need column name which is in database
    "make",
    "createdOn",
    "count",
    "actions",
  ];
  width: string;

  dataSource: ProductDataSource;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private productAdminService: ProductAdminService,
    private coreService: CoreService,
    private dialog: MatDialog,
  ) {
    this.width = this.coreService.getWidth();
    // this.isLoading$ = this.coreService.getIsLoading().pipe(
    //   shareReplay()
    // );
  }

  ngOnInit(): void {
   
    //this.loadProduct();
   // this.productAdminService.allProductForView$.subscribe(val => console.log('Val',val));
   this.dataSource = new ProductDataSource(this.productAdminService);
        this.dataSource.loadProduct();
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

  addProduct() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;

    //dialogConfig.data = {};

    this.dialog.open(ProductDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe(val=>{
         // this.loadProduct();
    });
  }


  ngAfterViewInit() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
    // this.paginator.page
    // .pipe(
    //     tap(() => this.loadProductPage())
    // )
    // .subscribe();
    this.sort.sortChange
    .pipe(
        tap(() => this.loadProductPage())
    )
    .subscribe();
  }

  loadProductPage() {
    this.dataSource.changeProductLoadParams(
        '',
        this.sort.active,
        this.sort.direction);
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onDeleteProduct(id: string){
    this.coreService.setIsLoading(true);
      this.productAdminService.delete(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe((value) => {
        this.coreService.presentSnackbar('Product item deleted successfully');
       // this.loadProduct();
      },
      err=>{
        console.log(err);
      }
      );;
  }
}
