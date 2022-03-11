import { ProductAdminService } from './../admin/admin-product.service';
import { CoreService } from '../../core/core.service';
import { Product } from '../../model/product';

import { Injectable } from '@angular/core';
import {
   Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailResolver implements Resolve<Product> {

  constructor(private productAdminService: ProductAdminService,
    private coreService: CoreService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId = route.paramMap.get('id');
    //console.log('Inside ProductItemResolver', productId);
    //resolver automatically subscribes and return the data of observable
    //but observable needs to complete
    //in firebase observable does not complete
    this.coreService.setIsLoading(true);
    return this.productAdminService.getProductData(productId);
  }
}
