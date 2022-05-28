import {
  AdminConfigService,
  SelectValues,
} from "./../../admin/admin-config/admin-config.service";
import { Product } from "../../../model/product";
import { ProductAdminService } from "../../admin/product/product-admin.service";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import {
  catchError,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { Observable, of } from "rxjs";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { CoreService } from "app/core/core.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "productlist",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  isLoading$: Observable<boolean>;
  productCount$: Observable<number>;

  filterCategory;
  categoryFormControl = new FormControl("");

  filteredOptions$: Observable<SelectValues[]>;
  options$: Observable<SelectValues[]>;

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
    private adminConfigService: AdminConfigService,
    private coreService: CoreService
  ) {
    this.products$ = this.productAdminService.allProductForView$.pipe(
      shareReplay()
    );
    this.options$ = this.adminConfigService.allMakesSorted$;
  }

  ngOnInit(): void {
    this.isLoading$ = this.coreService.getIsLoading();
    this.filteredOptions$ = this.categoryFormControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      switchMap((name) => (name ? this.filter(name || "") : this.options$))
    );
    this.coreService.setIsLoading(true);
  }

  filter(val: string): Observable<SelectValues[]> {
    return this.options$.pipe(
      map((response) =>
        response.filter((option) => {
          return option.viewValue.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      )
    );
  }
  displayFn(selectValues: SelectValues): string {
    return selectValues && selectValues.viewValue ? selectValues.viewValue : "";
  }

  ngOnDestroy(): void {
    this.coreService.setIsLoading(false);
    this.productAdminService.setSelectedFilter("");
  }

  filterByCategory(category: String) {
    console.log("Filter By category Selected", category);
    this.filterCategory = category;
    this.productAdminService.setSelectedFilter(this.filterCategory);
    switch (this.filterCategory) {
      case "brand":
        this.options$ = this.adminConfigService.allMakesSorted$;
        this.categoryFormControl.setValue("");
        return;
      case "type":
        this.options$ = this.adminConfigService.allTypesSorted$;
        this.categoryFormControl.setValue("");
        //this.cdr.detectChanges();
        return;
      default:
        //when user selects no filter we need to show all products
        //since selected filter is empty the below statement will go to
        //default case in service and fetch all products
        this.coreService.setIsLoading(true);
        this.productAdminService.selectedFilterValueChanged("");
        return (this.options$ = undefined);
    }
  }

  //Code for displaying Table
  categorySelected(event, category: SelectValues): void {
    if (event.isUserInput) {
      console.log(
        `Filter By ${this.filterCategory} viewValue: ${category.viewValue}  value: ${category.value}`
      );
      //No need to invoke database when only filter changes
      this.coreService.setIsLoading(true);
      this.productAdminService.selectedFilterValueChanged(category.value);
    }
  }
  //PRODUCT SORTING
  sortProductsByColumn(sortColumn: string = "createdOn") {
    //! BUG IN SORTING BY PRICE as discounted price
    //! will have to be taken into account while sorting on price
    console.log(` sortColumn:${sortColumn}`);
    if (sortColumn === "discount") {
      console.log("Sort column is discount");
      this.products$ = this.products$.pipe(
        map((products) =>
          products.sort((a, b) =>
            (a.discountValue || "") < (b.discountValue || "") ? -1 : 1
          )
        )
      );
    } else {
      this.coreService.setIsLoading(true);
      this.productAdminService.selectedColumnChanged(sortColumn);
    }
  }
  sortProductsByOrder(
    sortColumn: string = "createdOn",
    sortDirection: any = "asc"
  ) {
    console.log(` sortColumn:${sortColumn} sortDirection:${sortDirection}`);
    if (sortColumn === "discount") {
      console.log("Sort column is discount");
      if (sortDirection === "asc") {
        this.products$ = this.products$.pipe(
          map((products) =>
            products.sort((a, b) =>
              (a.discountValue || "") < (b.discountValue || "") ? -1 : 1
            )
          )
        );
      } else {
        this.products$ = this.products$.pipe(
          map((products) =>
            products.sort((a, b) =>
              (a.discountValue || "") < (b.discountValue || "") ? 1 : -1
            )
          )
        );
      }
    } else {
      this.coreService.setIsLoading(true);
      this.productAdminService.selectedOrderChanged(sortDirection);
    }
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
}
