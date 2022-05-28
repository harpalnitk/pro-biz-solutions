import { DiscountHistory } from "../../../../../model/discount-history";
import { AdminUsersService } from "../../admin-users.service";
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
  selector: "user-history",
  templateUrl: "./user-history.component.html",
  styleUrls: ["./user-history.component.scss"],
})
export class UserHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading$: Observable<boolean>;
  displayedColumns: string[] = ["index", "action", "value", "date", "userName"];
  dataSource: MatTableDataSource<DiscountHistory>;
  @ViewChild(MatSort) sort: MatSort;
  userId;
  sub: Subscription;

  constructor(
    private coreService: CoreService,
    private adminUsersService: AdminUsersService,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    //On changes in history reload the data
    this.sub = this.adminUsersService
      .getHistoryEventNotification()
      .subscribe(() => {
        if (this.userId) {
          this.loadUserHistory(this.userId);
        }
      });

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get("id");
      this.loadUserHistory(this.userId);
    });
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  loadUserHistory(id: string) {
    this.coreService.setIsLoading(true);
    this.adminUsersService
      .loadUserHistory(id)
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
