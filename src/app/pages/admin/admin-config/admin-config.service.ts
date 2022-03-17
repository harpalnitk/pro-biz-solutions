
import { catchError, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { CoreService } from '../../../core/core.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {convertSnaps} from '../../../services/db-utils';
import { combineLatest, Observable, Subject, throwError } from 'rxjs';



export interface SelectValues {
  value: string;
  viewValue: string;
  subType?: SelectValues[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminConfigService {

  makes: SelectValues[] = [];
  types: SelectValues[] = [];

  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,) { }

     allConfig$ = this.db.collection("configData").snapshotChanges()
     .pipe(
       map((snaps) => convertSnaps<any>(snaps)),
       map(val => val[0]),
       catchError(this.handleError),
       shareReplay(1) // shareReplay will cache the values and thus server will be accessed only once
     );

     allDiscount$ = this.db.collection("discount").valueChanges({idField:'id'})
     .pipe(
      tap((val)=>{console.log('Discount values 1',val)}),
      // map((snaps) => convertSnaps<any>(snaps)),
       //tap((val)=>{console.log('Discount values',val)}),
       catchError(this.handleError),
       shareReplay(1) // shareReplay will cache the values and thus server will be accessed only once
     );

     allMakes$ = this.allConfig$.pipe(
       map(val => val.makes)
     )
     allTypes$ = this.allConfig$.pipe(
      map(val => val.types)
    )
      // Sort the categories for the type ahead display
    allMakesSorted$ = this.allMakes$.pipe(
    map(makes => this.sortSelectValues(makes)),
    shareReplay(1)
  );

        // Sort the categories for the type ahead display
        allTypesSorted$ = this.allTypes$.pipe(
          map(types => this.sortSelectValues(types)),
          shareReplay(1)
        );

  sortSelectValues(selectValues: SelectValues[]): SelectValues[] {
    return selectValues.sort((a, b) => a.viewValue < b.viewValue ? -1 : 1);
  }

  //!subtype for selected type
      selectedTypeSubject = new Subject<string>();
      selectedType$ = this.selectedTypeSubject.asObservable();
      
      subTypesForTypeSorted$ = combineLatest([
        this.selectedType$,
        this.allTypes$
      ]).pipe(
        map(([selectedType, types]) => this.mapSubTypeAndType(selectedType,types)),
        map(subTypes => this.sortSelectValues(subTypes)),
      );

      mapSubTypeAndType(selectedType: string, types: SelectValues[]): SelectValues[] {
        return types.find(c => c.value === selectedType).subType;
      }

      selectedTypeChanged(type: string): void {
        this.selectedTypeSubject.next(type);
      }
          //Use only once for loading data on firebase server
  //then delete it
  saveConfigData(){
    const data ={
    types:  [
      { value: "t-0", viewValue: "Mobile", subType: [
        { value: "st-0", viewValue: "Phone" },
        { value: "st-1", viewValue: "Bluetooth" },
        { value: "st-2", viewValue: "Headphone" },
        { value: "st-3", viewValue: "Charger" },
      ] },
      { value: "t-1", viewValue: "Refrigerator", subType: [
        { value: "st-0", viewValue: "Double Door" },
        { value: "st-1", viewValue: "Single Door" },
        { value: "st-2", viewValue: "Commercial" },
        { value: "st-3", viewValue: "Basic" },
      ]  },
      { value: "t-2", viewValue: "AC" , subType: [
        { value: "st-0", viewValue: "Hot and Cool" },
        { value: "st-1", viewValue: "Inverter" },
        { value: "st-2", viewValue: "Window" },
        { value: "st-3", viewValue: "Split" },
      ] },
      { value: "t-3", viewValue: "Television", subType: [
        { value: "st-0", viewValue: "LED" },
        { value: "st-1", viewValue: "LCD" },
        { value: "st-2", viewValue: "Smart TV" },
        { value: "st-3", viewValue: "Plasma TV" },
      ]  },
    ],
    makes:  [
      { value: "m-0", viewValue: "Nokia" },
      { value: "m-1", viewValue: "Oppo" },
      { value: "m-2", viewValue: "Samsung" },
      { value: "m-3", viewValue: "Apple" },
      { value: "m-4", viewValue: "LG" },
      { value: "m-4", viewValue: "BPL" },
      { value: "m-4", viewValue: "Hitachi" },
      { value: "m-4", viewValue: "Voltas" },
      { value: "m-4", viewValue: "Tata" },
    ]
  }
  
  
      return this.db
      .collection(
        "configData",
        //(ref) => ref.orderBy("seqNo")
        // ref.where("seqNo","==",5)
        // .where("lessonsCount",=)
      )
      .add(data)
      .then(value => {
        console.log('configData',value);
      });
    }

















    // loadConfigData(){
    //   console.log('Load Config Data');
    //   return this.db
    //     .collection(
    //       "configData",
    //       //(ref) => ref.orderBy("seqNo")
    //       // ref.where("seqNo","==",5)
    //       // .where("lessonsCount",=)
    //     )
    //     .snapshotChanges()
    //     .pipe(
    //       map((snaps) => convertSnaps<any>(snaps)),
    //       first()
    //     ).subscribe( val=>{
    //       console.log('configData', val);
    //       this.makes = val[0].makes;
    //       this.types = val[0].types;
    //     });
    // }
  
    // getMakes(){
    //   return this.makes;
    // }
  
    // getTypes(){
    //   return this.types;
    // }
    // convertProductForView(val:Product): Product{
    //   const makeView  = this.getMakeViewValue(val.make);
    //   const typeAndSubTypeView  = this.getTypeAndSubTypeViewValue(val.type, val.subType);
    //    return {...val,makeView,...typeAndSubTypeView };
    // }
    // getMakeViewValue(value:string){
    //   if(!this.makes){
    //     return null;
    //   }
    //   return this.makes.filter(item => item.value === value)[0].viewValue;
    // }
    // getTypeAndSubTypeViewValue(type:string, subType:string){
    //   if(!this.types){
    //     return null;
    //   }
    //  const selectedType = this.types.filter(item => item.value === type)[0];
    //  const typeView = selectedType.viewValue;
    //  const subTypeView = selectedType.subType.filter(item => item.value === subType)[0].viewValue;
    //  return {typeView,subTypeView};
    // }
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
  
  
}
