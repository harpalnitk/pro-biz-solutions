import { CoreService } from '../../../core/core.service';
import { AdminProfile } from '../../../model/profile.model';

import { AdminUsersService } from './admin-users.service';
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
export class UserResolver implements Resolve<AdminProfile> {

  constructor(private adminUsersService: AdminUsersService,
    private coreService: CoreService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminProfile> {
    const userId = route.paramMap.get('id');
    console.log('Inside UserResolver', userId);
    //resolver automatically subscribes and return the data of observable
    //but observable needs to complete
    //in firebase observable does not complete
    this.coreService.setIsLoading(true);
    return this.adminUsersService.getUserData(userId);
  }
}
