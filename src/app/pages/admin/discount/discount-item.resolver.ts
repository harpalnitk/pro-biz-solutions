import { CoreService } from '../../../core/core.service';
import { Discount } from '../../../model/discount';

import { AdminDiscountService } from './admin-discount.service';
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
export class DiscountItemResolver implements Resolve<Discount> {

  constructor(private adminDiscountService: AdminDiscountService,
    private coreService: CoreService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Discount> {
    const discountId = route.paramMap.get('id');
    console.log('Inside DiscountItemResolver', discountId);
    //resolver automatically subscribes and return the data of observable
    //but observable needs to complete
    //in firebase observable does not complete
    this.coreService.setIsLoading(true);
    return this.adminDiscountService.getDiscountData(discountId);
  }
}
