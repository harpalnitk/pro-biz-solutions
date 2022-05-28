import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserProfile } from '../../model/profile.model';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<Observable<UserProfile>>{
  constructor(private profileService: ProfileService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Observable<UserProfile>> {
    // id will not be present in case of /me path of individual user
    let id = route.paramMap.get('id');
    console.log('Id in resolver', id);
    if (id) {
      return of(this.profileService.getProfileDataByUserId(id));
    } else {
      return of(
        this.profileService.getProfileData().pipe(
          tap((data) => {
            console.log(data);
          }),
          catchError((error) => {
            console.log('Error in profile resolver', error);
            return EMPTY;
          })
        )
      );
    }
  }
}
