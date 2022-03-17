import { AdminDiscountService } from './admin-discount.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";

import {catchError, finalize, tap} from "rxjs/operators";
import { Discount } from '../../../model/discount';



export class DiscountDataSource implements DataSource<Discount> {

    private discountsSubject = new BehaviorSubject<Discount[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private adminDiscountService: AdminDiscountService) {

    }

    loadDiscount() {

        this.loadingSubject.next(true);

        // this.coursesService.findLessons(courseId, filter, sortDirection,
        //     pageIndex, pageSize).pipe(
        //         catchError(() => of([])),
        //         finalize(() => this.loadingSubject.next(false))
        //     )
        //     .subscribe(lessons => this.lessonsSubject.next(lessons));
        this.adminDiscountService.allDiscount$.pipe(
                catchError(() => of([])),
                tap(() => this.loadingSubject.next(false)) 
                //finalize not used here because this subscription will not end
        ).subscribe(discounts => this.discountsSubject.next(discounts));

    }

    changeDiscountLoadParams(                
        filter?:string,
        sortColumn?:string,
        sortDirection?:any,
        pageIndex?:number,
        pageSize?:number){

        console.log(`filter:${filter} sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
         this.adminDiscountService.selectedColumnChanged(sortColumn);
         this.adminDiscountService.selectedOrderChanged(sortDirection);
    }

    connect(collectionViewer: CollectionViewer): Observable<Discount[]> {
       //console.log("Connecting data source");
        return this.discountsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.discountsSubject.complete();
        this.loadingSubject.complete();
    }

}