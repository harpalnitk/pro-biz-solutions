import { Discount } from "./../../../model/discount";
import {
  AdminConfigService,
  SelectValues,
} from "../admin-config/admin-config.service";
import { User } from "../../../model/user";
import { ProductHistory as ProductHistory } from "../../../model/product-history";

import { convertSnaps } from "../../../services/db-utils";
import { CoreService } from "../../../core/core.service";

import { Product } from "../../../model/product";

import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  Query,
  CollectionReference,
} from "@angular/fire/firestore";

import {
  from,
  Observable,
  of,
  Subject,
  throwError,
  combineLatest,
  BehaviorSubject,
} from "rxjs";

import {
  catchError,
  finalize,
  first,
  map,
  switchMap,
  tap,
} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductAdminService {
  productCollection: AngularFirestoreCollection<Product>;
  user: User;
  selectedFilter = "";

  //history$
  history$ = new Subject();

  // Input Parameters for fetching products
  selectedColumnSubject = new BehaviorSubject<string>("createdOn");
  selectedColumn$ = this.selectedColumnSubject.asObservable();
  selectedColumnChanged(column: string): void {
    console.log('Selected column Changed',column)
    this.selectedColumnSubject.next(column);
  }
  //Acsending Descending
  selectedOrderSubject = new BehaviorSubject<"asc" | "desc">("desc");
  selectedOrder$ = this.selectedOrderSubject.asObservable();
  selectedOrderChanged(order: "asc" | "desc"): void {
    console.log('Selected Order Changed',order)
    this.selectedOrderSubject.next(order);
  }

  //Filter Category
  setSelectedFilter(filter: "brand" | "type" | ""): void {
    this.selectedFilter = filter;
  }
  //Filter Category Value
  selectedFilterValueSubject = new BehaviorSubject<string>('');
  selectedFilterValue$ = this.selectedFilterValueSubject.asObservable();
  selectedFilterValueChanged(filterValue: string): void {
    this.selectedFilterValueSubject.next(filterValue);
  }
  // allProductQuery$ = combineLatest([
  //   this.selectedColumn$,
  //   this.selectedOrder$,
  //   this.selectedFilterValue$,
  // ]).pipe(
  //   switchMap(([column, order, filterValue]) => {
  //     console.log(
  //       `column:${column} order:${order} filter: ${this.selectedFilter} filterValue: ${filterValue}`
  //     );
  //     switch (this.selectedFilter) {
  //       case "brand":
  //         return this.db
  //           .collection<Product>("product", (ref) => ref.orderBy(column, order))
  //           .snapshotChanges();
  //       case "type":
  //         return this.db
  //           .collection<Product>("product", (ref) => ref.orderBy(column, order))
  //           .snapshotChanges();
  //       default:
  //         return this.db
  //           .collection<Product>("product", (ref) => ref.orderBy(column, order))
  //           .snapshotChanges();
  //     }
  //   })
  // );

  allProductQuery$ = combineLatest([
    this.selectedColumn$,
    this.selectedOrder$,
    this.selectedFilterValue$,
  ]).pipe(
   // tap(val=> this.coreService.setIsLoading(true)),
    switchMap(([column, order, filterValue]) => {
      console.log(
        `column:${column} order:${order} filter: ${this.selectedFilter} filterValue: ${filterValue}`
      );

      return this.db
        .collection<Product>("product", (ref) => {
          let query: CollectionReference | Query = ref;
          switch (this.selectedFilter) {
            case "brand":
                return query.where('make','==',filterValue).orderBy(column, order);
            case "type":
              return query.where('type','==',filterValue).orderBy(column, order);
            default:
              return query.orderBy(column, order);
          }
        })
        .snapshotChanges();
    })
  );

  allProduct$ = this.allProductQuery$.pipe(
    tap(val=> this.coreService.setIsLoading(false)),
    map((snaps) => convertSnaps<Product>(snaps)),
     tap(val=> console.log('snaps', val)),
    //first(), // we don't want observable to continuously run
    catchError(this.handleError)
  );

  // Match up product with their make, type and subType ViewValues.
  allProductForView$ = combineLatest([
    this.allProduct$,
    this.adminConfigService.allMakes$,
    this.adminConfigService.allTypes$,
    this.adminConfigService.allDiscount$,
  ]).pipe(
    //first(), // we don't want observable to continuously run
    map(([products, makes, types, discounts]) =>
      this.mapProductsForView(products, makes, types, discounts)
    )
  );

  allProductForViewSortedOnDiscount$ = this.allProductForView$.pipe(
    map((products) =>
      products.sort((a, b) =>
        (a.discountValue || 0) < (b.discountValue || "") ? -1 : 1
      )
    )
  );

  mapProductsForView(
    products: Product[],
    makes: SelectValues[],
    types: SelectValues[],
    discounts?: any
  ): Product[] {
    //console.log('Original Products',products);
    //let newProducts;
   return  products.map((product) =>
      this.mapProductForView(product, makes, types, discounts)
    );
    //console.log('New Products',newProducts);
   // return newProducts;
  }
  mapProductForView(
    product: Product,
    makes: SelectValues[],
    types: SelectValues[],
    discounts?: any
  ): Product {
    // console.log('mapProductForView Data',product);
    let makeView =
      makes.find((c) => product.make === c.value)?.viewValue || "No Make";
    let type = types.find((c) => product.type === c.value);
    let typeView = type?.viewValue || "No Type";
    let subTypeView =
      type.subType.find((c) => product.subType === c.value)?.viewValue ||
      "No Sub Type";
    let discountValue = 0;
    let discountDesc = "";
    if (discounts) {
      discountValue =
        discounts.find((c) => product.discountId === c.id)?.value || 0;
      discountDesc =
        discounts.find((c) => product.discountId === c.id)?.desc || "";
    }
    return {
      ...product,
      makeView,
      typeView,
      subTypeView,
      discountValue,
      discountDesc,
    } as Product;
  }

  getHistoryEventNotification() {
    return this.history$.asObservable();
  }

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private coreService: CoreService,
    private adminConfigService: AdminConfigService
  ) {
    this.productCollection = this.db.collection<Product>("product");

    this.afAuth.authState.subscribe((user) => (this.user = user));
  }

  //  loadAllProduct(): Observable<Product[]> {

  //   return this.db
  //     .collection(
  //       "product",
  //       (ref) => ref.orderBy("createdOn", "desc")
  //       // ref.where("seqNo","==",5)
  //       // .where("lessonsCount",=)
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((snaps) => convertSnaps<Product>(snaps)),
  //       first(),
  //       map(val=> val.map(product => this.productConfigService.convertProductForView(product)))
  //       // if we add first rxjs operator here then
  //       //the observable will complete after fetching
  //       //valuse from firestore and behave like normal http
  //       //observable; firebase continous changes will not be recorded
  //       //take(5)///////////////////
  //       // will receive only first 5 changes and after that if any changes are made in server
  //       //the same will not be reflected
  //     );
  // }

  addProduct(
    name: string,
    desc: string,
    type: string,
    subType: string,
    make: string,
    price: number,
    discountId: string,
    photoURL: string,
    count: number = 0
  ) {
    console.log("In add product", this.user);
    this.coreService.setIsLoading(true);
    if (this.user) {
      // this.uiService.presentLoading('Submitting Complaint...');
      const newProduct = {
        name,
        desc,
        type,
        subType,
        make,
        price,
        discountId,
        photoURL,
        count,
        createdOn: new Date(),
        createdBy: this.user.uid,
      };
      //delete newComplaint.id;
      console.log("In add product", JSON.stringify(newProduct));
      return from(this.productCollection.add({ ...newProduct }));
    } else {
      this.coreService.presentSnackbar("Please Login to add product item!");
      return;
    }
  }

  addEventToItemHistory(productItemId: string, action: string, qty: string) {
    console.log("In  addEventToItemHistory", this.user);
    const newEvent = {
      action: action,
      qty,
      userId: this.user.uid,
      userName: this.user.displayName ? this.user.displayName : `User`,
      date: new Date(),
    };
    console.log("In  addEventToItemHistory", JSON.stringify(newEvent));
    return from(
      this.getProduct(productItemId)
        .collection("history")
        .add({ ...newEvent })
    )
      .pipe(first())
      .subscribe(
        () => {
          this.history$.next();
          console.log("Event History updated succesfully");
        },
        (err) => {
          console.log("Error in updating Event History ", err);
        }
      );
  }

  getProduct(id: string) {
    return this.db.doc<Product>(`product/${id}`);
  }

  getProductData(id): Observable<Product> {
    //console.log('getProduct Data');
    return combineLatest([
      this.getProduct(id).valueChanges({ idField: "id" }),
      this.adminConfigService.allMakes$,
      this.adminConfigService.allTypes$,
    ]).pipe(
      first(), // Item resolver shows data only when observable completes.
      map(([product, makes, types]) =>
        this.mapProductForView(product, makes, types)
      )
    );
  }

  delete(id: string) {
    if (this.user) {
      return from(this.getProduct(id).delete());
    } else {
      this.coreService.presentSnackbar("Please Login to delete product item!");
    }
  }
  updateProduct(id: string, data: Partial<Product>) {
    if (this.user) {
      return from(
        this.getProduct(id).update({
          ...data,
          updatedOn: new Date(),
          updatedBy: this.user.uid,
        })
      );
    } else {
      this.coreService.presentSnackbar("Please Login to update product item!");
    }
  }

  async runTransaction(id: string, changedCount: number) {
    if (this.user) {
      this.coreService.setIsLoading(true);
      try {
        const newCount = await this.db.firestore.runTransaction(
          async (transaction) => {
            console.log("Running Tansaction (Product Count Change)...");
            const productRef = this.db.doc(`/product/${id}`).ref;
            //get document snapshot
            const snap = await transaction.get(productRef);
            const product = <Product>snap.data();
            const count = changedCount;
            //write count back to database
            transaction.update(productRef, { count });
            //always pass result through return
            //and never assign new value to component level variables
            return count;
          }
        );
        this.addEventToItemHistory(id, "QUANTITY CHANGED", "" + newCount);
        this.coreService.setIsLoading(false);
        return newCount;
      } catch (error) {
        this.coreService.setIsLoading(false);
        console.log("Error in changing product Count", error);
        this.coreService.setMessage("Error in changing product Count!!");
      }
    } else {
      this.coreService.presentSnackbar("Please Login to change product count!");
    }
  }

  loadProductItemHistory(productItemId: string) {
    return this.getProduct(productItemId)
      .collection("history", (ref) => ref.orderBy("date", "desc"))
      .snapshotChanges()
      .pipe(
        map((snaps) => convertSnaps<ProductHistory>(snaps)),
        first()
      );
  }

  //Use only once for loading data on firebase server
  //then delete it
  saveConfigData() {
    const data = {
      types: [
        {
          value: "t-0",
          viewValue: "Mobile",
          subType: [
            { value: "st-0", viewValue: "Phone" },
            { value: "st-1", viewValue: "Bluetooth" },
            { value: "st-2", viewValue: "Headphone" },
            { value: "st-3", viewValue: "Charger" },
          ],
        },
        {
          value: "t-1",
          viewValue: "Refrigerator",
          subType: [
            { value: "st-0", viewValue: "Double Door" },
            { value: "st-1", viewValue: "Single Door" },
            { value: "st-2", viewValue: "Commercial" },
            { value: "st-3", viewValue: "Basic" },
          ],
        },
        {
          value: "t-2",
          viewValue: "AC",
          subType: [
            { value: "st-0", viewValue: "Hot and Cool" },
            { value: "st-1", viewValue: "Inverter" },
            { value: "st-2", viewValue: "Window" },
            { value: "st-3", viewValue: "Split" },
          ],
        },
        {
          value: "t-3",
          viewValue: "Television",
          subType: [
            { value: "st-0", viewValue: "LED" },
            { value: "st-1", viewValue: "LCD" },
            { value: "st-2", viewValue: "Smart TV" },
            { value: "st-3", viewValue: "Plasma TV" },
          ],
        },
      ],
      makes: [
        { value: "m-0", viewValue: "Nokia" },
        { value: "m-1", viewValue: "Oppo" },
        { value: "m-2", viewValue: "Samsung" },
        { value: "m-3", viewValue: "Apple" },
        { value: "m-4", viewValue: "LG" },
        { value: "m-4", viewValue: "BPL" },
        { value: "m-4", viewValue: "Hitachi" },
        { value: "m-4", viewValue: "Voltas" },
        { value: "m-4", viewValue: "Tata" },
      ],
    };

    return this.db
      .collection(
        "configData"
        //(ref) => ref.orderBy("seqNo")
        // ref.where("seqNo","==",5)
        // .where("lessonsCount",=)
      )
      .add(data)
      .then((value) => {
        console.log("configData", value);
      });
  }
  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.log('Complete error',err);
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
