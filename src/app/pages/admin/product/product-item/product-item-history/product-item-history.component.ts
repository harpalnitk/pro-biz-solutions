import { ProductHistory } from "../../../../../model/product-history";
import { ProductAdminService } from "../../product-admin.service";
import { CoreService } from "../../../../../core/core.service";
import { Observable, Subscription } from "rxjs";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { finalize } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "product-item-history",
  templateUrl: "./product-item-history.component.html",
  styleUrls: ["./product-item-history.component.scss"],
})
export class ProductItemHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading$: Observable<boolean>;
  displayedColumns: string[] = ["index", "action", "qty", "date", "userName"];
  dataSource: MatTableDataSource<ProductHistory>;
  @ViewChild(MatSort) sort: MatSort;
  productId;
  sub: Subscription;

  constructor(
    private coreService: CoreService,
    private productAdminService: ProductAdminService,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    //On changes in history reload the data
    this.sub = this.productAdminService
      .getHistoryEventNotification()
      .subscribe(() => {
        if (this.productId) {
          this.loadProductItemHistory(this.productId);
        }
      });

    this.route.paramMap.subscribe((params) => {
      this.productId = params.get("id");
      this.loadProductItemHistory(this.productId);
    });
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  loadProductItemHistory(id: string) {
    this.coreService.setIsLoading(true);
    this.productAdminService
      .loadProductItemHistory(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe(
        (value) => {
          console.log(value);
          this.dataSource = new MatTableDataSource(value);
          this.dataSource.sort = this.sort;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
