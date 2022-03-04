import { ProductAdminService } from './product-admin.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";

import {catchError, finalize} from "rxjs/operators";
import { Product } from '../../model/product';



export class ProductDataSource implements DataSource<Product> {

    private productsSubject = new BehaviorSubject<Product[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private productAdminService: ProductAdminService) {

    }

    loadProduct() {

        this.loadingSubject.next(true);

        // this.coursesService.findLessons(courseId, filter, sortDirection,
        //     pageIndex, pageSize).pipe(
        //         catchError(() => of([])),
        //         finalize(() => this.loadingSubject.next(false))
        //     )
        //     .subscribe(lessons => this.lessonsSubject.next(lessons));
        this.productAdminService.allProductForView$.pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)) 
        ).subscribe(products => this.productsSubject.next(products));

    }

    changeProductLoadParams(                
        filter?:string,
        sortColumn?:string,
        sortDirection?:any,
        pageIndex?:number,
        pageSize?:number){

        console.log(`filter:${filter} sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
         this.productAdminService.selectedColumnChanged(sortColumn);
         this.productAdminService.selectedOrderChanged(sortDirection);
    }

    connect(collectionViewer: CollectionViewer): Observable<Product[]> {
        console.log("Connecting data source");
        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
    }

}