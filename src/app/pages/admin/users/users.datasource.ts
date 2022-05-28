import { CoreService } from './../../../core/core.service';
import { AdminProfile } from '../../../model/profile.model';
import { AdminUsersService } from './admin-users.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";

import {catchError, finalize, tap} from "rxjs/operators";




export class UsersDataSource implements DataSource<AdminProfile> {

    private usersSubject = new BehaviorSubject<AdminProfile[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private adminUserService: AdminUsersService) {

    }

    loadUsers() {

        this.loadingSubject.next(true);

        // this.coursesService.findLessons(courseId, filter, sortDirection,
        //     pageIndex, pageSize).pipe(
        //         catchError(() => of([])),
        //         finalize(() => this.loadingSubject.next(false))
        //     )
        //     .subscribe(lessons => this.lessonsSubject.next(lessons));
        this.adminUserService.allUserForView$.pipe(
                catchError(() => of([])),
                tap((val) => {
                    console.log('Inside all user in datasource',val)
                    this.loadingSubject.next(false)
                }) 
                //finalize not used here because this subscription will not end
        ).subscribe(users => this.usersSubject.next(users));

    }

    changeUsersLoadParams(                
        sortColumn?:string,
        sortDirection?:any,
        pageIndex?:number,
        pageSize?:number){

        console.log(`sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
         this.adminUserService.selectedColumnChanged(sortColumn);
         this.adminUserService.selectedOrderChanged(sortDirection);
    }

    filterData(search){
        this.adminUserService.selectedFilterValueChanged(search);
    }

    connect(collectionViewer: CollectionViewer): Observable<AdminProfile[]> {
       //console.log("Connecting data source");
        return this.usersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usersSubject.complete();
        this.loadingSubject.complete();
    }

}