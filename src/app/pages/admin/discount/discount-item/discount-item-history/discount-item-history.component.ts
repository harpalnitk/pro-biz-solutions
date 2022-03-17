import { DiscountHistory } from "../../../../../model/discount-history";
import { AdminDiscountService } from "../../admin-discount.service";
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
  selector: "discount-item-history",
  templateUrl: "./discount-item-history.component.html",
  styleUrls: ["./discount-item-history.component.scss"],
})
export class DiscountItemHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading$: Observable<boolean>;
  displayedColumns: string[] = ["index", "action", "value", "date", "userName"];
  dataSource: MatTableDataSource<DiscountHistory>;
  @ViewChild(MatSort) sort: MatSort;
  discountId;
  sub: Subscription;

  constructor(
    private coreService: CoreService,
    private adminDiscountService: AdminDiscountService,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    //On changes in history reload the data
    this.sub = this.adminDiscountService
      .getHistoryEventNotification()
      .subscribe(() => {
        if (this.discountId) {
          this.loadDiscountItemHistory(this.discountId);
        }
      });

    this.route.paramMap.subscribe((params) => {
      this.discountId = params.get("id");
      this.loadDiscountItemHistory(this.discountId);
    });
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  loadDiscountItemHistory(id: string) {
    this.coreService.setIsLoading(true);
    this.adminDiscountService
      .loadDiscountItemHistory(id)
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
