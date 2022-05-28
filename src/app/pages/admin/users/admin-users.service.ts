import { AdminProfile, ProfileConstants } from '../../../model/profile.model';
import { DiscountHistory } from '../../../model/discount-history';
import { User } from '../../../model/user';
import { CoreService } from '../../../core/core.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  Query
} from '@angular/fire/firestore';

import { from, Observable, of, Subject, throwError, combineLatest, BehaviorSubject } from 'rxjs';

import { catchError, finalize, first, map, switchMap, tap } from 'rxjs/operators';
import {convertSnaps} from '../../../services/db-utils';
@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  userCollection: AngularFirestoreCollection<User>;
  loggedInUser: User;

  userTypes = ProfileConstants.USER_TYPES;
  userStatus = ProfileConstants.USER_STATUS;
  userRoles = ProfileConstants.USER_ROLES;

    //history$
    history$ = new Subject()
  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,) {
      this.userCollection = this.db.collection<AdminProfile>('users');

      this.afAuth.authState.subscribe(user=> this.loggedInUser = user);
      }

     // Input Parameters for fetching products
     selectedColumnSubject = new BehaviorSubject<string>('email');
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
      //Filter Category Value
  selectedFilterValueSubject = new BehaviorSubject<string>('');
  selectedFilterValue$ = this.selectedFilterValueSubject.asObservable();
  selectedFilterValueChanged(filterValue: string): void {
    this.selectedFilterValueSubject.next(filterValue);
  }
    //  allUserQuery$ = combineLatest([
    //    this.selectedColumn$,
    //    this.selectedOrder$
    //  ]).pipe(
    //     switchMap(([column,order])=> { 
    //       console.log(`column:${column} order:${order}`)
    //       return this.db.collection<AdminProfile>('users',
    //     (ref) => ref.orderBy(column, order)).snapshotChanges()
    //  }
    //     )
    //  )

    allUserQuery$ = combineLatest([
      this.selectedColumn$,
      this.selectedOrder$,
      this.selectedFilterValue$,
    ]).pipe(
     // tap(val=> this.coreService.setIsLoading(true)),
      switchMap(([column, order, filterValue]) => {
        console.log(
          `column:${column} order:${order}  filterValue: ${filterValue}`
        );
        return this.db
          .collection<AdminProfile>("users", (ref) => {
            let query: CollectionReference | Query = ref;
            if(filterValue){
              return query.where('email','>=',filterValue).where('email','<=',filterValue+ '\uf8ff').orderBy(column, order);
            }else{
              return query.orderBy(column, order);
               }
            })
          .snapshotChanges();
      })
    );
  
     allUser$ = this.allUserQuery$
     .pipe(
       tap(val=> console.log('query', val)),
      map((snaps) => convertSnaps<AdminProfile>(snaps)),
     // tap(val=> console.log('snaps', val)),
      //first(), // we don't want observable to continuously run
      catchError(this.handleError)
    );

    allUserForView$ = this.allUser$.pipe(
      map((users)=>this.mapUsersForView(users))
    )

    mapUsersForView(users: AdminProfile[]){
          return users.map(user => this.mapUserForView(user) )
    }
    mapUserForView(user: AdminProfile){
      let viewRole = this.userRoles.find(c=> user?.official?.role === c.value)?.viewValue || "";
      let viewStatus = this.userStatus.find(c=> user?.status === c.value)?.viewValue || "";
      let viewUserType = this.userTypes.find(c=> user?.userType === c.value)?.viewValue || "";

      console.log(`viewRole ${viewRole} viewStatus ${viewStatus} viewUserType ${viewUserType}`);
      return{
        ...user,
        viewRole,
        viewStatus,
        viewUserType
      } as AdminProfile
    }

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

    // addDiscount(
    //   name: string,
    //   desc:string,
    //   value:number,

    // ) {
    //   console.log('In add discount', this.user);
    //   this.coreService.setIsLoading(true);
    //   if (this.user) {
    //    // this.uiService.presentLoading('Submitting Complaint...');
    //     const newDiscount = {name, desc, value, createdOn: new Date(), createdBy: this.user.uid}
    //     //delete newComplaint.id;
    //     console.log('In add discount', JSON.stringify(newDiscount));
    //     return from(this.discountCollection.add({ ...newDiscount }));
  
    //   } else {
    //     this.coreService.presentSnackbar('Please Login as admin to add discount!');
    //     return;
    //   }
    // }

    getUser(id: string) {
      return this.db.doc<AdminProfile>(`users/${id}`);
    }
    
    getUserData(id): Observable<AdminProfile> {
      console.log('get User Profile Data');
      return this.getUser(id).valueChanges({ idField: 'id' }).pipe(
        first(), // Item resolver shows data only when observable completes.
        map(user => this.mapUserForView(user) )
      );
    }
  
    delete(id: string) {
      if(this.loggedInUser){
        return  from(this.getUser(id).delete());
      }else{
        this.coreService.presentSnackbar('Please Login as admin to delete user!');
      }
    }
    updateUser(id: string, data: Partial<AdminProfile>) {
      if(this.loggedInUser){
        return  from(this.getUser(id).update({...data, updatedOn: new Date(), updatedBy: this.loggedInUser.uid}));
      }else{
        this.coreService.presentSnackbar('Please Login as admin to update user!');
      }
    }

    addEventToItemHistory(
      userId: string,
      action: string,
      value:string
    ) {
      console.log('In  addEventToItemHistory User', this.loggedInUser);
        const newEvent = {
          action: action,
          value ,
          userId: this.loggedInUser.uid,
          userName: this.loggedInUser.displayName ? this.loggedInUser.displayName : `User`,
          date: new Date() 
        }
        console.log('In  addEventToItemHistory User', JSON.stringify(newEvent));
        return from(this.getUser(userId).collection('history').add({ ...newEvent }))
        .pipe(
          first()
        ).subscribe(()=>{
         this.history$.next();
         console.log('User Event History updated succesfully');
        },
        err=>{
          console.log('Error in updating User Event History ',err);
        }
        );
   }
  
   getHistoryEventNotification(){
    return this.history$.asObservable();
 }

 loadUserHistory(userId: string){
  return this.getUser(userId)
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


