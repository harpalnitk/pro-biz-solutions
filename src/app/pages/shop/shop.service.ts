import { Product } from './../../model/product';
import { CoreService } from './../../core/core.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  shopURL = '/api/shop';
  private products$ = new BehaviorSubject<Product[]>([]);
  private productCount$ = new BehaviorSubject<number>(0);
  private products: Product[];
  constructor(private http: HttpClient, private router: Router,
    private coreService: CoreService,) {}

  fetchProducts(page: number = 0, pageSize: number = 10) {
    console.log('Inside fetchProducts');
    const requestURL = `${this.shopURL}/listProduct`;
    // const paramsData = {
    //   sort: 'asc',
    //   page: ''+page,
    //   pageSize: ''+pageSize
    // };
    // const httpParams = new HttpParams({ fromObject: paramsData });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', ''+page);
    httpParams = httpParams.append('pageSize', ''+pageSize);
    this.coreService.setIsLoading(true);
    return this.http
      .get<{products: Product[], count:number}>(requestURL, { params: httpParams })
      .subscribe(
        (res) => {
          this.coreService.setIsLoading(false);
          console.log(`Response from server in fetchProducts method`, res);
          this.products = res.products;
          this.products$.next(this.products);
          this.productCount$.next(res.count);
        },
        (err) => {
          console.log(`Error`, err);
          this.coreService.setMessage(err?.error?.msg);
          this.coreService.setIsLoading(false);
          if(err.status === 401){
            this.router.navigate(['/auth']);
          }
        }
      );
  }

  deleteProduct(id: string) {
    //Deleting Product in the front end app code only
    if(this.products){
      this.products = this.products.filter((p) => p.id !== id);
      this.products$.next(this.products);
    }
  }

  getProduct(id: string) {
    const requestURL = `${this.shopURL}/product/${id}`;
    return this.http.get<Product>(requestURL);
  }

  getProducts() {
    return this.products$.asObservable();
  }
  getProductCount() {
    return this.productCount$.asObservable();
  }
  addToCart(prodId: String) {
    const requestURL = `${this.shopURL}/cart`;
    // const paramsData = {
    //   sort: 'asc',
    // };
    //const httpParams = new HttpParams({ fromObject: paramsData });
    this.coreService.setIsLoading(true);
    return this.http
      .post(requestURL, { prodId }, { observe: 'response' })
      .pipe()
      .subscribe(
        (res) => {
          this.coreService.setIsLoading(false);
          console.log(`Response from server Add Product to Cart`, res)
      },
        (err) => {
          console.log('Error in adding product to cart', err);
          this.coreService.setIsLoading(false);
          this.coreService.setMessage(err?.error?.msg);
          if (err.status === 401) {
            this.router.navigateByUrl('/auth');
          }
        }
      );
  }
}
