import { DiscountHistory } from './../../../model/discount-history';
import { User } from './../../../model/user';
import { CoreService } from './../../../core/core.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Discount } from './../../../model/discount';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  Query
} from '@angular/fire/firestore';

import { from, Observable, of, Subject, throwError, combineLatest, BehaviorSubject } from 'rxjs';

import { catchError, finalize, first, map, switchMap, tap } from 'rxjs/operators';
import {convertSnaps} from '../../../services/db-utils';
@Injectable({
  providedIn: 'root'
})
export class AdminDiscountService {
  discountCollection: AngularFirestoreCollection<Discount>;
  discount: Discount;
  user: User;

    //history$
    history$ = new Subject()
  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,) {
      this.discountCollection = this.db.collection<Discount>('discount');

      this.afAuth.authState.subscribe(user=> this.user = user);
      }

     // Input Parameters for fetching products
     selectedColumnSubject = new BehaviorSubject<string>('createdOn');
     selectedColumn$ = this.selectedColumnSubject.asObservable();
     selectedColumnChanged(column: string): void {
      this.selectedColumnSubject.next(column);
    }
     //Acsending Descending
     selectedOrderSubject = new BehaviorSubject<'asc'|'desc'>('desc');
     selectedOrder$ = this.selectedOrderSubject.asObservable();
     selectedOrderChanged(order: 'asc'|'desc'): void {
      this.selectedOrderSubject.next(order);
    }
     allDiscountQuery$ = combineLatest([
       this.selectedColumn$,
       this.selectedOrder$
     ]).pipe(
        switchMap(([column,order])=> { 
          //console.log(`column:${column} order:${order}`)
          return this.db.collection<Discount>('discount',
        (ref) => ref.orderBy(column, order)).snapshotChanges()
     }
        )
     )
  
     allDiscount$ = this.allDiscountQuery$
     .pipe(
       //tap(val=> console.log('query', val)),
      map((snaps) => convertSnaps<Discount>(snaps)),
     // tap(val=> console.log('snaps', val)),
      //first(), // we don't want observable to continuously run
      catchError(this.handleError)
    );

    private handleError(err: any): Observable<never> {
      // in a real world app, we may send the server to some remote logging infrastructure
      // instead of just logging it to the console
      let errorMessage: string;
      if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
      }
      console.error(err);
      return throwError(errorMessage);
    }

    addDiscount(
      name: string,
      desc:string,
      value:number,

    ) {
      console.log('In add discount', this.user);
      this.coreService.setIsLoading(true);
      if (this.user) {
       // this.uiService.presentLoading('Submitting Complaint...');
        const newDiscount = {name, desc, value, createdOn: new Date(), createdBy: this.user.uid}
        //delete newComplaint.id;
        console.log('In add discount', JSON.stringify(newDiscount));
        return from(this.discountCollection.add({ ...newDiscount }));
  
      } else {
        this.coreService.presentSnackbar('Please Login as admin to add discount!');
        return;
      }
    }

    getDiscount(id: string) {
      return this.db.doc<Discount>(`discount/${id}`);
    }
    
    getDiscountData(id): Observable<Discount> {
      console.log('getDiscount Data');
      return this.getDiscount(id).valueChanges({ idField: 'id' }).pipe(
        first(), // Item resolver shows data only when observable completes.
      );
    }
  
    delete(id: string) {
      if(this.user){
        return  from(this.getDiscount(id).delete());
      }else{
        this.coreService.presentSnackbar('Please Login as admin to delete discount!');
      }
    }
    updateDiscount(id: string, data: Partial<Discount>) {
      if(this.user){
        return  from(this.getDiscount(id).update({...data, updatedOn: new Date(), updatedBy: this.user.uid}));
      }else{
        this.coreService.presentSnackbar('Please Login as admin to update discount item!');
      }
    }

    addEventToItemHistory(
      discountItemId: string,
      action: string,
      value:string
    ) {
      console.log('In  addEventToItemHistory Discount', this.user);
        const newEvent = {
          action: action,
          value ,
          userId: this.user.uid,
          userName: this.user.displayName ? this.user.displayName : `User`,
          date: new Date() 
        }
        console.log('In  addEventToItemHistory Discount', JSON.stringify(newEvent));
        return from(this.getDiscount(discountItemId).collection('history').add({ ...newEvent }))
        .pipe(
          first()
        ).subscribe(()=>{
         this.history$.next();
         console.log('Discount Event History updated succesfully');
        },
        err=>{
          console.log('Error in updating Discount Event History ',err);
        }
        );
   }
  
   getHistoryEventNotification(){
    return this.history$.asObservable();
 }

 loadDiscountItemHistory(discountItemId: string){
  return this.getDiscount(discountItemId)
    .collection(
      "history",
      (ref) => ref.orderBy("date", "desc")
    )
    .snapshotChanges()
    .pipe(
      map((snaps) => convertSnaps<DiscountHistory>(snaps)),
      first()
    );
}
}


