
import { UsersDataSource } from "../users.datasource";
import { CoreService } from "../../../../core/core.service";

import { UserDialogComponent } from "../user-dialog/user-dialog.component";

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { debounceTime, distinctUntilChanged, finalize, shareReplay, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AdminUsersService } from "../admin-users.service";
import { Subject } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
  selector: "users-table",
  templateUrl: "./users-table.component.html",
  styleUrls: ["./users-table.component.scss"],
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  // isLoading$: Observable<boolean>;
  displayedColumns: string[] = [
    "index",
    "email",
    "firstName", //not useing typeView because in sorting need column name which is in database
    "lastName",
    "userType",
    "role",
    "status",
    "actions",
  ];
  width: string;

  dataSource: UsersDataSource;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;

  //SEARCH BY EMAIL FUNCTIONALITY
   search = new FormControl();




  constructor(
    private adminUsersService: AdminUsersService,
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
    this.dataSource = new UsersDataSource(this.adminUsersService);

    this.dataSource.loadUsers();
  }


  


  getDialogConfig(){
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;
    
    return dialogConfig;
  }
  


  ngAfterViewInit() {
    this.sort.sortChange.pipe(tap(() => this.loadUsersPage())).subscribe();
    this.search.valueChanges
            .pipe(
          debounceTime(1000),
          distinctUntilChanged()
        ).subscribe(
          value => {
            console.log("Search Value changed: " + value);
      
              this.coreService.setIsLoading(true);
              this.dataSource.filterData(value);
            
        }
        )
  }

  loadUsersPage() {
    this.dataSource.changeUsersLoadParams(
      this.sort.active,
      this.sort.direction
    );
  }


  onDeleteUser(id: string) {
    this.coreService.setIsLoading(true);
    this.adminUsersService
      .delete(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe(
        (value) => {
          this.coreService.presentSnackbar("User deleted successfully");
          // this.loadProduct();
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
