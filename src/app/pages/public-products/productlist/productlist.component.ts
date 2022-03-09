import { Product } from './../../../model/product';
import { ProductAdminService } from './../../products/product-admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { CoreService } from 'app/core/core.service';

@Component({
  selector: 'productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {
  products$: Observable<Product[]>;
  isLoading$: Observable<boolean>;
  productCount$: Observable<number>;

  // MatPaginator Inputs
  // length = 0;
  // pageSize = 10;
  // pageSizeOptions = [5, 10, 25, 100];
  // pageIndex = 0;
  // // MatPaginator Output
  // pageEvent: PageEvent;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private productAdminService: ProductAdminService,
    private coreService: CoreService
  ) {
    this.products$ = this.productAdminService.allProductForView$.pipe(shareReplay());
   // this.productCount$ = this.productAdminService.getProductCount();
  }

  ngOnInit(): void {
    this.isLoading$ = this.coreService.getIsLoading();
   // this.productAdminService.fetchAdminProducts();
  }
  // handlePageEvent($event: PageEvent) {
  //   console.log($event);
  //   this.pageSize = $event.pageSize;
  //   this.paginator.pageSize = $event.pageSize;
  //   this.pageIndex = $event.pageIndex;
  //   this.paginator.pageIndex = $event.pageIndex;
  //   this.productAdminService.fetchAdminProducts($event.pageIndex, $event.pageSize);
  // }

//   changeProductLoadParams(                
//     filter?:string,
//     sortColumn?:string,
//     sortDirection?:any,
//     pageIndex?:number,
//     pageSize?:number){

//     console.log(`filter:${filter} sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
//      this.productAdminService.selectedColumnChanged(sortColumn);
//      this.productAdminService.selectedOrderChanged(sortDirection);
// }
  ngOnDestroy(): void {
    this.coreService.setIsLoading(false);
  }

  sortProducts(sortColumn:string= 'createdOn',
    sortDirection:any = 'asc',){
      console.log(` sortColumn:${sortColumn} sortDirection:${sortDirection}`)
    this.productAdminService.selectedColumnChanged(sortColumn);
    this.productAdminService.selectedOrderChanged(sortDirection);
  }

}
